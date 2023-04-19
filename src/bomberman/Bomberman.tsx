import {IComponentProps} from "../Box";
import {CELL_SIZE, FIELD_SIZE} from "./config";
import {GameModel} from "./models/GameModel";
import {InfoPanel} from "./info_panel/InfoPanel";
import {Field} from "./field/Field";
import {Player} from "./player/Player";
import "./Bomberman.scss";
import React from "react";

interface IState {
    model: GameModel,
    gamePause: boolean,
    gameOver: boolean,
    victory: boolean,
}

export class Bomberman extends React.Component<IComponentProps, IState> {
    gameAreaRef = React.createRef<HTMLDivElement>();
    prevTime = 0;

    constructor(props: IComponentProps) {
        super(props);

        this.state = {
            model: new GameModel(FIELD_SIZE),
            gamePause: false,
            gameOver: false,
            victory: false,
        };

        this.props.onChangeGeometry({
            minSize: {w: FIELD_SIZE.w * 40, h: FIELD_SIZE.h * 40},
            aspectRatio: {w: FIELD_SIZE.w, h: FIELD_SIZE.h},
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

    private frame = (time: number) => {
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

        if (this.state.model.players.find(p => p.state.life < 0))
            this.setState({gameOver: true});
        else if (!this.state.gamePause)
            this.setState(this.state);
    }

    private handleKeyDown = (e: KeyboardEvent) => {
        if (!this.props.active || this.state.gameOver)
            return;

        if (e.key === 'Escape')
            this.setState({gamePause: !this.state.gamePause});
    }

    private resetGame() {
        this.setState({
            model: new GameModel(FIELD_SIZE),
            gamePause: false,
            gameOver: false,
            victory: false,
        });
    }

    private calcOffset() {
        const areaWidth = this.gameAreaRef.current?.offsetWidth || 0;
        const areaHeight = this.gameAreaRef.current?.offsetHeight || 0;
        const fieldWidth = this.state.model.width * CELL_SIZE + 2;
        const fieldHeight = this.state.model.height * CELL_SIZE + 2;

        const playerX = CELL_SIZE * (this.state.model.players[0].pos.x + 0.5) + 1;
        const playerY = CELL_SIZE * (this.state.model.players[0].pos.y + 0.5) + 1;
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
                     fontSize: Math.min(this.props.height * 0.05, this.props.width * 0.05),
                 }}>

                <InfoPanel stats={this.state.model.players[0].state}/>

                <div className="game-area" ref={this.gameAreaRef}>
                    <div className="scene">
                        <Field model={this.state.model} offset={offset}/>
                        <Player position={this.state.model.players[0].pos} offset={offset}/>
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