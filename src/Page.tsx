import React from "react";
import {Box, BoxType} from "./Box";
import {iconsPng} from "./icons/images";
import {ModeSelector} from "./ModeSelector";
import {ThemeChanger} from "./ThemeChanger";

interface IBoxData {
    x: number,
    y: number,
    width: number,
    height: number,
    active: boolean,
    text: any,
    type: BoxType,
}

interface IState {
    boxes: { [id: number]: IBoxData };
    modeType: BoxType | undefined,
    lightTheme: boolean,
}

export class Page extends React.Component<{}, IState> {
    counter = 0;
    activeBoxId = 0;

    constructor(props = {}) {
        super(props);

        const stateData = localStorage.getItem('state');
        this.state = stateData ? JSON.parse(stateData) : {boxes: {}, modeType: undefined, lightTheme: true};

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
        if (id === this.activeBoxId)
            return;

        if (this.state.boxes[this.activeBoxId])
            this.state.boxes[this.activeBoxId].active = false;

        this.state.boxes[id].active = true;
        this.activeBoxId = id;
        this.updateState();
    }

    handleSelectMode = (type: BoxType | undefined, e: React.MouseEvent) => {
        this.setState({modeType: type});
        e.stopPropagation();
    }

    handleChangeTheme = () => {
        this.setState({lightTheme: !this.state.lightTheme});
    }

    handleClick = (e: React.MouseEvent) => {
        if (this.state.modeType === undefined)
            return;

        this.counter++;

        this.state.boxes[this.counter] = {
            x: e.clientX,
            y: e.clientY,
            width: 200,
            height: 200,
            active: true,
            text: '',
            type: this.state.modeType,
        }

        this.handleActive(this.counter);
        this.handleSelectMode(undefined, e);
    }

    render() {
        return (
            <div className="App"
                 onClick={this.handleClick}
                 style={{
                     cursor: this.state.modeType !== undefined ? `url(${iconsPng[this.state.modeType]}), auto` : "default",
                     background: this.state.lightTheme ? "white" : "black",
                 }}>
                {Object.entries(this.state.boxes).map(([key, b]) => <Box
                    x={b.x}
                    y={b.y}
                    width={b.width}
                    height={b.height}
                    active={b.active}
                    text={b.text}
                    onChange={(id, e) => this.changeBoxState(id, e)}
                    onMove={(id, pos) => this.changeBoxState(id, pos)}
                    onResize={(id, size) => this.changeBoxState(id, {width: size.w, height: size.h})}
                    onClose={this.handleClose}
                    onActive={this.handleActive}
                    id={Number(key)}
                    key={key}
                    type={b.type}
                />)}
                <ModeSelector selected={this.state.modeType} onSelectMode={this.handleSelectMode}/>
                <ThemeChanger lightTheme={this.state.lightTheme} onChangeTheme={this.handleChangeTheme}/>
            </div>
        );
    }

    changeBoxState = (id: number, data: Partial<IBoxData>) => {
        // TODO split common state to separate box states
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