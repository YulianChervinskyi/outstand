import {IComponentProps} from "../Box";
import {BONUS_FILLING, CELL_SIZE, FIELD_SIZE} from "./config";
import {GameModel} from "./models/GameModel";
import {InfoPanelDev} from "./info_panel_dev/InfoPanelDev";
import {Field} from "./field/Field";
import {Player} from "./player/Player";
import "./Bomberman.scss";
import React from "react";
import {EBonusType} from "./types";
import {InfoPanel} from "./info_panel/InfoPanel";
import {AIService} from "./services/AIService";
import {ServerController, HumanController} from "./Controls";

interface IState {
    gamePause: boolean,
    gameOver: boolean,
    devMode: boolean,
    victory: boolean,
    model: GameModel,
}

export class Bomberman extends React.Component<IComponentProps, IState> {
    private gameAreaRef = React.createRef<HTMLDivElement>();
    private bonuses: EBonusType[];
    private prevTime = 0;
    private service = new AIService();
    private controllers = [new HumanController(), new ServerController()];
    private areControllersInProgress = false;

    constructor(props: IComponentProps) {
        console.log('constructor');
        super(props);
        const data = JSON.parse(this.props.text || '{}');
        this.bonuses = data?.bonuses || this.fillBonuses();

        this.state = {
            gamePause: data?.gamePause || false,
            gameOver: data?.gameOver || false,
            devMode: data?.devMode || false,
            victory: data?.victory || false,
            model: new GameModel(FIELD_SIZE, data?.model, this.bonuses, this.controllers.map(c => c.states)),
        };

        this.props.onChangeGeometry({
            minSize: {w: FIELD_SIZE.w * 40, h: FIELD_SIZE.h * 40},
        });
    }

    setState<K extends keyof IState>(state: Pick<IState, K> | IState | null) {
        super.setState(state, () => {
            this.props.onChange({text: this.store()});
        });
    }

    private store() {
        return JSON.stringify({
            model: this.state.model.store(),
            gamePause: this.state.gamePause,
            gameOver: this.state.gameOver,
            devMode: this.state.devMode,
            victory: this.state.victory,
            bonuses: this.bonuses,
        });
    }

    componentDidMount() {
        document.body.addEventListener("keydown", this.handleKeyDown);
        requestAnimationFrame(this.frame);
    }

    componentDidUpdate(prevProps: Readonly<IComponentProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (this.state.gamePause || this.state.gameOver)
            return;

        if (prevProps.active && !this.props.active)
            this.setState({gamePause: true});
    }

    componentWillUnmount() {
        document.body.removeEventListener("keydown", this.handleKeyDown);
    }

    private frame = async (time: number) => {
        const seconds = (time - this.prevTime) / 1000;
        this.prevTime = time;

        if (seconds > 0 && seconds < 0.2)
            this.update(seconds);

        requestAnimationFrame(this.frame);
    }

    private update(seconds: number) {
        if (!this.props.active || this.state.gameOver || this.state.gamePause)
            return;

        this.state.model.update(seconds);

        if (!this.areControllersInProgress) {
            this.areControllersInProgress = true;
            this.processServerControllers()
                .catch(console.error)
                .finally(() => this.areControllersInProgress = false);
        }

        if (this.state.model.players.find(p => p.state.life < 0))
            this.setState({gameOver: true});
        else if (!this.state.gamePause)
            this.setState(this.state);
    }

    private async processServerControllers() {
        const modelState = this.state.model.getModelStateByPlayer(1);
        const controller = this.controllers[1] as ServerController;
        const controls = await this.service.sendState(modelState);
        controller.setControls(controls);
    }

    private handleKeyDown = (e: KeyboardEvent) => {
        if (!this.props.active || this.state.gameOver)
            return;

        if (e.key === 'Escape')
            this.setState({gamePause: !this.state.gamePause});
        else if (e.ctrlKey && e.key === '`')
            this.setState({devMode: !this.state.devMode});
    }

    resetGame() {
        this.bonuses = this.fillBonuses();
        this.setState({
            gamePause: false,
            gameOver: false,
            devMode: false,
            victory: false,
            model: new GameModel(FIELD_SIZE, "", this.bonuses, this.controllers.map(c => c.states)),
        });
    }

    private fillBonuses() {
        return Object.entries(BONUS_FILLING)
            .reduce((acc, [type, quantity]) => acc.concat(Array(quantity).fill(+type)), [] as EBonusType[]);
    }

    private calcOffset() {
        const areaWidth = this.gameAreaRef.current?.offsetWidth || 0;
        const areaHeight = this.gameAreaRef.current?.offsetHeight || 0;
        const fieldWidth = this.state.model.width * CELL_SIZE + 2;
        const fieldHeight = this.state.model.height * CELL_SIZE + 2;

        const playerX = CELL_SIZE * (this.state.model?.players[0].pos.x + 0.5) + 1;
        const playerY = CELL_SIZE * (this.state.model?.players[0].pos.y + 0.5) + 1;
        const playerCenterOffsetX = areaWidth / 2 - playerX;
        const playerCenterOffsetY = areaHeight / 2 - playerY;

        const maxOffsetX = areaWidth - fieldWidth;
        const maxOffsetY = areaHeight - fieldHeight;

        return {
            x: Math.min(Math.max(playerCenterOffsetX, maxOffsetX), Math.max(maxOffsetX / 2, 0)),
            y: Math.min(Math.max(playerCenterOffsetY, maxOffsetY), Math.max(maxOffsetY / 2, 0)),
        }
    }

    render() {
        const offset = this.calcOffset();

        return (
            <div className="bomberman"
                 style={{
                     width: this.props.width,
                     height: this.props.height,
                     fontSize: Math.min(this.props.height * 0.06, this.props.width * 0.05),
                 }}>

                {this.state.devMode
                    ? <InfoPanelDev stats={this.state.model.players[0].state}/>
                    : <InfoPanel stats={this.state.model.players.map(p => p.state)}/>}

                <div className="game-area" ref={this.gameAreaRef}>
                    <div className="scene">
                        <Field model={this.state.model} offset={offset}/>
                        {this.state.model.players.map(p =>
                            <Player position={p.pos} offset={offset}/>)}
                        {/*<Player position={this.state.model.players[0].pos} offset={offset}/>*/}
                    </div>
                </div>

                {this.state.gamePause && <div className="info-overlay">
                    Paused
                    <div className="controls">
                        <button onClick={() => this.setState({gamePause: false})}>Continue</button>
                        <button onClick={() => this.resetGame()}>Restart</button>
                    </div>
                </div>}

                {this.state.gameOver && <div className="info-overlay">
                    {this.state.victory ? "Victory!" : "Game over!"}
                    <div className="controls">
                        <button onClick={() => this.resetGame()}>Restart</button>
                    </div>
                </div>}
            </div>
        );
    }
}