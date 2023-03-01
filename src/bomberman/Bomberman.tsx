import {IComponentProps} from "../Box";
import {CELL_SIZE, FIELD_SIZE} from "./config";
import {GameModel} from "./models/GameModel";
import {InfoPanel} from "./info_panel/InfoPanel";
import {Field} from "./field/Field";
import {PlayerModel} from "./models/PlayerModel";
import {Player} from "./player/Player";
import "./Bomberman.scss";
import React from "react";
import {Controls} from "./Controls";

export class Bomberman extends React.Component<IComponentProps, {}> {
    controls = new Controls();
    player = new PlayerModel(this.controls.states);
    model = new GameModel(FIELD_SIZE, [this.player]);
    gameAreaRef = React.createRef<HTMLDivElement>();
    prevTime = 0;

    constructor(props: IComponentProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        requestAnimationFrame(this.frame);
    }

    frame = (time: number) => {
        const seconds = (time - this.prevTime) / 1000;
        this.prevTime = time;

        if (seconds > 0 && seconds < 0.2)
            this.update(seconds);

        this.setState({});
        requestAnimationFrame(this.frame);
    }

    update(seconds: number) {
        if (!this.props.active)
            return;

        this.model.update(seconds);
    }

    calcOffset() {
        const areaWidth = this.gameAreaRef.current?.offsetWidth || 0;
        const areaHeight = this.gameAreaRef.current?.offsetHeight || 0;
        const fieldWidth = this.model.width * CELL_SIZE + 2;
        const fieldHeight = this.model.height * CELL_SIZE + 2;

        const playerX = CELL_SIZE * (this.player.pos.x + 0.5) + 1;
        const playerY = CELL_SIZE * (this.player.pos.y + 0.5) + 1;
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
            <div
                className="bomberman"
                style={{
                    width: this.props.width,
                    height: this.props.height,
                    fontSize: Math.min(this.props.height * 0.05, this.props.width * 0.05),
                }}
            >
                <InfoPanel/>
                <div className="game-area" ref={this.gameAreaRef}>
                    <div className="scene">
                        <Field model={this.model} offset={offset}/>
                        <Player position={this.player.pos} offset={offset}/>
                    </div>
                </div>
            </div>
        );
    }
}