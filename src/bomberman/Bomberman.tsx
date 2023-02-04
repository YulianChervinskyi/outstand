import {IComponentProps} from "../Box";
import {FIELD_SIZE} from "./config";
import {GameModel} from "./GameModel";
import {InfoPanel} from "./info_panel/InfoPanel";
import {Field} from "./field/Field";
import "./Bomberman.scss";
import React from "react";

export class Bomberman extends React.Component<IComponentProps, {}> {
    model = new GameModel(FIELD_SIZE);

    constructor(props: IComponentProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="bomberman"
                 style={{
                     width: this.props.width,
                     height: this.props.height,
                     fontSize: Math.min(this.props.height * 0.05, this.props.width * 0.05),
                 }}>
                <InfoPanel/>
                <Field model={this.model}/>
            </div>
        );
    }
}