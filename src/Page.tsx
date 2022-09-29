import React from "react";
import {Box} from "./Box";

interface IBoxData {
    x: number,
    y: number,
    width: number,
    height: number,
    active: boolean,
    text: string,
}

interface IState {
    boxes: { [id: number]: IBoxData };
}

export class Page extends React.Component<{}, IState> {
    counter = 0;
    activeBoxId = 0;

    constructor(props = {}) {
        super(props);
        this.state = {boxes: {}};
    }

    handleClose = (id: number) => {
        delete this.state.boxes[id];
        this.setState(this.state);
        console.log(id);
    }

    handleActive = (id: number) => {
        this.state.boxes[this.activeBoxId].active = false;
        this.state.boxes[id].active = true;
        this.activeBoxId = id;
        this.setState(this.state);
    }

    handleDoubleClick = (e: React.MouseEvent) => {
        this.state.boxes[this.counter] = {
            x: e.clientX,
            y: e.clientY,
            width: 200,
            height: 200,
            active: true,
            text: '',
        }

        this.setState(this.state);

        this.handleActive(this.counter);
        this.counter++;
    }

    render() {
        return (
            <div className="App" onDoubleClick={this.handleDoubleClick}>
                {Object.entries(this.state.boxes).map(([key, b]) => <Box
                    x={b.x}
                    y={b.y}
                    width={b.width}
                    height={b.height}
                    active={b.active}
                    text={b.text}
                    onChange={(e) => console.log(e)}
                    onMove={(pos) => console.log(pos)}
                    onResize={(size) => console.log(size)}
                    onClose={this.handleClose}
                    onActive={this.handleActive}
                    id={Number(key)}
                    key={key}
                />)}
            </div>
        );
    }
}
