import {IComponentProps} from "../Box";
import {FIELD_SIZE} from "./config";
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
                    <Player position={this.player.pos}/>
                </div>
            </div>
        );
    }
}