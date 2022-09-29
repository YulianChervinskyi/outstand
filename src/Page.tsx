import React from "react";
import {Box} from "./Box";

interface IState {
    boxes: JSX.Element[];
}

export class Page extends React.Component<{}, IState> {
    counter = 0;

    constructor(props = {}) {
        super(props);
        this.state = {boxes: []};
    }

    handleClose = (id: number) => {
        this.setState({boxes: this.state.boxes.filter(b => Number(b.key) !== id)});
        console.log(id);
    }

    handleActive = (id: number) => {
        /*make for all boxes zIndex == 0*/
/*
        style.zIndex = 1;
        this.setState(this.state);
*/
    }

    handleClick = (e: React.MouseEvent) => {
        const newBox = <Box
            x={e.clientX}
            y={e.clientY}
            width={200}
            height={200}
            onChange={(e) => console.log(e)}
            onMove={(pos) => console.log(pos)}
            onResize={(size) => console.log(size)}
            onClose={this.handleClose}
            onActive={this.handleActive}
            id={this.counter}
            key={this.counter++}
        />;

        this.state.boxes.push(newBox);
        this.setState(this.state);
    }

    render() {
        return (
            <div className="App" onDoubleClick={this.handleClick}>
                {this.state.boxes}
            </div>
        );
    }
}
