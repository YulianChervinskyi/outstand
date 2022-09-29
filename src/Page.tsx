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
    counter = 1;
    activeBoxId = 1;

    constructor(props = {}) {
        super(props);

        const stateData = localStorage.getItem('state');
        this.state = stateData ? JSON.parse(stateData) : {boxes: {}};

        const keys = Object.keys(this.state.boxes);
        this.counter = keys.length > 0 ? Number(keys[keys.length - 1]) + 1 : this.counter;

        const activeBoxPair = Object.entries(this.state.boxes).find(([_, b]) => b.active);
        this.activeBoxId = activeBoxPair ? Number(activeBoxPair[0]) : this.activeBoxId;
    }

    handleClose = (id: number) => {
        delete this.state.boxes[id];
        this.changeState();
    }

    handleActive = (id: number) => {
        this.state.boxes[this.activeBoxId].active = false;
        this.state.boxes[id].active = true;
        this.activeBoxId = id;
        this.changeState();
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
        this.saveData();

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
                    onChange={(id, e) => this.changeState(id, e)}
                    onMove={(id, pos) => this.changeState(id, pos)}
                    onResize={(id, size) => this.changeState(id, size)}
                    onClose={this.handleClose}
                    onActive={this.handleActive}
                    id={Number(key)}
                    key={key}
                />)}
            </div>
        );
    }

    changeState = (id?: number, data?: Partial<IBoxData>) => {
        if (data && id)
            this.state.boxes[id] = {...this.state.boxes[id], ...data};

        this.setState(this.state);
        this.saveData();
    }

    saveData = () => {
        localStorage.setItem('state', JSON.stringify(this.state));
    }
}
