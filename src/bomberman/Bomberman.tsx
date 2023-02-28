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
import {IPoint} from "./types";

export class Bomberman extends React.Component<IComponentProps, {}> {
    controls = new Controls();
    player = new PlayerModel(this.controls.states);
    model = new GameModel(FIELD_SIZE, [this.player]);
    gameAreaRef = React.createRef<HTMLDivElement>();
    screenOffset: IPoint = {x: 0, y: 0};
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

        this.calcScreenOffset();
    }

    calcScreenOffset() {
        const pos = {x: this.player.pos.x * CELL_SIZE, y: this.player.pos.y * CELL_SIZE};

        const gameAreaW = this.gameAreaRef.current?.offsetWidth || 0;
        const gameAreaH = this.gameAreaRef.current?.offsetHeight || 0;
        const sceneW = this.model.width * CELL_SIZE + 2;
        const sceneH = this.model.height * CELL_SIZE + 2;

        if (pos.x >= gameAreaW / 2 && pos.x + gameAreaW / 2 <= sceneW)
            this.screenOffset.x = gameAreaW / 2 - pos.x;
        else if (gameAreaW >= sceneW)
            this.screenOffset.x = (gameAreaW - sceneW) / 2;

        if (pos.y >= gameAreaH / 2 && pos.y + gameAreaH / 2 <= sceneH)
            this.screenOffset.y = gameAreaH / 2 - pos.y;
        else if (gameAreaH >= sceneH)
            this.screenOffset.y = (gameAreaH - sceneH) / 2;
    }

    render() {
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
                        <Field model={this.model} offset={this.screenOffset}/>
                        <Player position={this.player.pos} offset={this.screenOffset}/>
                    </div>
                </div>
            </div>
        );
    }
}