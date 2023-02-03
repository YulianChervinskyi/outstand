import {IComponentProps} from "../Box";
import {InfoPanel} from "./info_panel/InfoPanel";
import {fieldSize} from "./config";
import {Field} from "./field/Field";
import "./Bomberman.scss";
import React from "react";

interface IState {

}

export class Bomberman extends React.Component<IComponentProps, IState> {


    constructor(props: IComponentProps) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="bomberman"
                 style={{
                     width: `calc(${this.props.width}px + 8px)`,
                     height: `calc(${this.props.height}px + 5px)`,
                     fontSize: Math.min(this.props.height * 0.05, this.props.width * 0.05),
                 }}>
                <InfoPanel/>
                <Field/>
            </div>
        );
    }
}