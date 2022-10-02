import React from "react";
import {Box} from "./Box";
import {Calc} from "./calc/Calc";

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

        const stateData = localStorage.getItem('state');
        this.state = stateData ? JSON.parse(stateData) : {boxes: {}};

        const keys = Object.keys(this.state.boxes);
        this.counter = keys.length > 0 ? Number(keys[keys.length - 1]) : this.counter;

        const activeBoxPair = Object.entries(this.state.boxes).find(([_, b]) => b.active);
        this.activeBoxId = activeBoxPair ? Number(activeBoxPair[0]) : this.activeBoxId;
    }

    handleClose = (id: number) => {
        delete this.state.boxes[id];
        this.updateState();
    }

    handleActive = (id: number) => {
        if (this.state.boxes[this.activeBoxId])
            this.state.boxes[this.activeBoxId].active = false;

        this.state.boxes[id].active = true;
        this.activeBoxId = id;
        this.updateState();
    }

    handleDoubleClick = (e: React.MouseEvent) => {
        this.counter++;

        this.state.boxes[this.counter] = {
            x: e.clientX,
            y: e.clientY,
            width: 200,
            height: 200,
            active: true,
            text: '',
        }

        this.updateState();
        this.handleActive(this.counter);
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
                    onChange={(id, e) => this.changeBoxState(id, e)}
                    onMove={(id, pos) => this.changeBoxState(id, pos)}
                    onResize={(id, size) => this.changeBoxState(id, size)}
                    onClose={this.handleClose}
                    onActive={this.handleActive}
                    id={Number(key)}
                    key={key}
                />)}
                <Calc width={150} height={150} />
            </div>
        );
    }

    changeBoxState = (id: number, data: Partial<IBoxData>) => {
        this.state.boxes[id] = {...this.state.boxes[id], ...data};
        this.updateState();
    }

    updateState = () => {
        this.setState(this.state);
        this.saveData();
    }

    saveData = () => {
        localStorage.setItem('state', JSON.stringify(this.state));
    }
}
