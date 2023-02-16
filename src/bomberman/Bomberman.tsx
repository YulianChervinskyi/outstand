import {IComponentProps} from "../Box";
import {FIELD_SIZE} from "./config";
import {GameModel} from "./GameModel";
import {InfoPanel} from "./info_panel/InfoPanel";
import {Field} from "./field/Field";
import {Player} from "./player/Player";
import "./Bomberman.scss";
import React from "react";
import {Controls} from "../asteroids/Controls";

export class Bomberman extends React.Component<IComponentProps, {}> {
    model = new GameModel(FIELD_SIZE);
    controls = new Controls();
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
        if (!this.props.active) return;

        let checkedOffset: { x: number, y: number };

        const offsetX = this.model.player.speed * seconds * (Number(this.controls.states.right) - Number(this.controls.states.left));
        const offsetY = this.model.player.speed * seconds * (Number(this.controls.states.backward) - Number(this.controls.states.forward));

        if (offsetX || offsetY) {
            checkedOffset = this.model.playerOffsetCheck(offsetX, offsetY);
            this.model.player.walk(checkedOffset.x, checkedOffset.y);
        }
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
                <div className="game-area">
                    <Field model={this.model}/>
                    <Player position={this.model.player.position}/>
                </div>
            </div>
        );
    }
}