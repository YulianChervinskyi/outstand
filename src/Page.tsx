import React from "react";
import {Box} from "./Box";

interface IState {
    boxes: JSX.Element[];
}

export class Page extends React.Component<{}, IState>
{
    constructor() {
        super({});
        this.state = {boxes: []};

        setInterval(() => {
            this.setState((s) => {
                s.boxes.splice(0, 1);
                return s;
            })
        }, 5000);
    }

    handleClick = (e: React.MouseEvent) =>
    {
        const newBox = <Box
            x={e.clientX}
            y={e.clientY}
            width={50}
            height={50}
            text={`${Math.round(e.clientX/e.clientY)}`}
            onClick={(e) => {e.stopPropagation();}}
        />;

        this.setState((s) => {
            s.boxes.push(newBox);
            return s;
        })
    }

    render() {
        return (<div className="App" onClick={this.handleClick}>
            {this.state.boxes}
        </div>);
    }
}
