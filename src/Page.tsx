import React from "react";
import {Box} from "./Box";

interface IState {
    boxes: JSX.Element[];
}

export class Page extends React.Component<{}, IState>
{
    counter = 0;

    constructor() {
        super({});
        this.state = {boxes: []};

        // setInterval(() => {
        //     this.setState((s) => {
        //         s.boxes.splice(0, 1);
        //         return s;
        //     })
        // }, 5000);
    }

    handleClick = (e: React.MouseEvent) =>
    {
        const newBox = <Box
            x={e.clientX}
            y={e.clientY}
            width={'auto'}
            height={50}
            text={`${++this.counter}`}
            onChange={(e) => console.log(e)}
            onMove={(pos) => console.log(pos)}
            onResize={(size) => console.log(size)}
            onClose={() => console.log('close')}
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
