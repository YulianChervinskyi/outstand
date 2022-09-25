import React from "react";
import {Box} from "./Box";

interface IState {
    boxes: JSX.Element[];
}

export class Page extends React.Component<{}, IState>
{
    counter = 0;

    constructor(props = {}) {
        super(props);
        this.state = {boxes: []};
    }

    handleClick = (e: React.MouseEvent) =>
    {
        const newBox = <Box
            x={e.clientX}
            y={e.clientY}
            width={200}
            height={200}
            onChange={(e) => console.log(e)}
            onMove={(pos) => console.log(pos)}
            onResize={(size) => console.log(size)}
            onClose={() => console.log('close')}
            key={this.counter++}
        />;

        this.state.boxes.push(newBox);
        this.setState(this.state);
    }

    render() {
        return (<div className="App" onDoubleClick={this.handleClick}>
            {this.state.boxes}
        </div>);
    }
}
