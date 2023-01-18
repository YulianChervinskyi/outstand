import {GameField} from "./GameField";
import {ControlPanel} from "./ControlPanel";
import {ECellState, EDifficultyType, gameProps, ICell} from "./config";
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
    gameField: ICell[][],
}

export class Minesweeper extends React.Component<IProps, IState> {
    intervalId: NodeJS.Timeout | undefined = undefined;
    isGameOn: boolean = false;
    counter: number = 0;

    constructor(props: IProps) {
        super(props);
        this.state = {
            timer: 0,
            flagNumber: gameProps[EDifficultyType.Medium].mines,
            gameField: this.createGameField(EDifficultyType.Medium),
        };
    }

    handleChangeDifficulty = (difficulty: EDifficultyType) => {
        this.resetGame();

        this.setState({
            timer: this.counter,
            flagNumber: gameProps[difficulty].mines,
            gameField: this.createGameField(difficulty),
        });
    }

    handleCellClick = (x: number, y: number) => {
        if (this.state.gameField[y][x].value) {
            this.state.gameField[y][x].state = ECellState.Open;
        } else {
            checkNearbyCells(openNearbyCells, this.state.gameField, x, y);
        }

        if (this.isGameOn)
            return;

        this.isGameOn = true;

        this.intervalId = setInterval(() => {
            this.counter++;
            this.setState({timer: this.counter});
            if (this.counter === 999)
                this.stopTimer();
        }, 1000);
    }

    createGameField = (difficulty: EDifficultyType) => {
        const field: ICell[][] = [];
        const {width, height, mines} = gameProps[difficulty];

        for (let y = 0; y < height; y++) {
            field.push([]);
            for (let x = 0; x < width; x++) {
                field[y].push({value: 0, state: ECellState.Closed});
            }
        }

        for (let i = 0; i < mines; i++) {
            const x = Math.floor(Math.random() * width);
            const y = Math.floor(Math.random() * height);

            if (field[y][x].value === 9) {
                i--;
            } else {
                field[y][x].value = 9;
                checkNearbyCells(markCellsNearbyMine, field, x, y);
            }
        }

        return field;
    }

    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }

    resetGame = () => {
        this.counter = 0;
        this.isGameOn = false;
        this.stopTimer();
    }


    componentWillUnmount() {
        this.stopTimer();
    }

    render() {
        return (
            <div className="minesweeper"
                 style={{width: this.props.width, height: this.props.height, backgroundColor: "#819462"}}>
                <ControlPanel
                    timer={this.state.timer}
                    flagNumber={this.state.flagNumber}
                    changeDifficulty={this.handleChangeDifficulty}
                />
                <GameField
                    onCellClick={this.handleCellClick}
                    gameField={this.state.gameField}
                />
            </div>
        );
    }
}

function markCellsNearbyMine(field: ICell[][], x: number, y: number) {
    if (field[y] && field[y][x] && field[y][x].value !== 9) {
        field[y][x].value += 1;
    }
}

function checkNearbyCells(callback: (field: ICell[][], x: number, y: number) => void, field: ICell[][], x: number, y: number) {
    for (let i = y - 1; i < y + 2; i++) {
        for (let j = x - 1; j < x + 2; j++) {
            callback(field, j, i);
        }
    }
}

function openNearbyCells(field: ICell[][], x: number, y: number) {
    if (field[y] && field[y][x] && field[y][x].state === ECellState.Closed) {
        if (!field[y][x].value) {
            field[y][x].state = ECellState.Open;
            checkNearbyCells(openNearbyCells, field, x, y);
        }
        field[y][x].state = ECellState.Open;
    }
}
