import {IComponentProps} from "../Box";
import {FIELD_SIZE} from "./config";
import {GameModel} from "./GameModel";
import {InfoPanel} from "./info_panel/InfoPanel";
import {Field} from "./field/Field";
import {Player} from "./player/Player";
import "./Bomberman.scss";
import React from "react";

export class Bomberman extends React.Component<IComponentProps, {}> {
    model = new GameModel(FIELD_SIZE);
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

        // if (seconds > 0 && seconds < 0.2)
            this.model.makeMove(this.props.active, seconds);

        this.setState({});
        requestAnimationFrame(this.frame);
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
                    <Player model={this.model}/>
                </div>
            </div>
        );
    }
}