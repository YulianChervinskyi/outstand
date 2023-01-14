import {GameField} from "./GameField";
import {ControlPanel} from "./ControlPanel";
import {cell, DifficultyType, gameProps} from "./config";
import React from "react";

export interface IProps {
    width: number,
    height: number,
    text: string,
    onChange: (e: { text: string }) => void,
}

interface IState {
    timer: number,
    flagNumber: number,
    gameField: number[][],
}

export class Minesweeper extends React.Component<IProps, IState> {
    intervalId: NodeJS.Timeout | undefined = undefined;
    isGameStarted = false;
    counter = 0;

    constructor(props: IProps) {
        super(props);
        this.state = {
            timer: 0,
            flagNumber: gameProps[DifficultyType.Normal].mines,
            gameField: this.createGameField(DifficultyType.Normal),
        };
    }

    handleChangeDifficulty(difficulty: DifficultyType) {
        this.setState({
            flagNumber: gameProps[difficulty].mines,
            gameField: this.createGameField(difficulty)
        });
    }

    createGameField(difficulty: DifficultyType) {
        const field: number[][] = Array(gameProps[difficulty].height).fill(Array(gameProps[difficulty].width).fill(cell.value.V0));
        return field;
    }

    componentDidMount() {
        this.intervalId = this.isGameStarted ?
            setInterval(() => {
                this.counter++;
                this.setState({timer: this.counter});
                if (this.counter === 999)
                    clearInterval(this.intervalId);
            }, 1000) : undefined;
    }

    componentWillUnmount() {
        if (this.intervalId)
            clearInterval(this.intervalId);
    }

    render() {
        return (
            <div style={{width: "100%", height: "100%", backgroundColor: "#819462"}}>
                <ControlPanel
                    timer={this.state.timer}
                    flagNumber={this.state.flagNumber}
                    changeDifficulty={this.handleChangeDifficulty}
                />
                <GameField
                    gameStarted={(value) => this.isGameStarted = value}
                    gameField={this.state.gameField}
                />
            </div>
        );
    }
}