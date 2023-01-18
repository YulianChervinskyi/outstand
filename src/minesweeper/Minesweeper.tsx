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

    handleCellClick = () => {
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

        for (let y = 0; y < gameProps[difficulty].height; y++) {
            field.push([]);
            for (let x = 0; x < gameProps[difficulty].width; x++) {
                field[y].push({value: 0, state: ECellState.Open});
            }
        }

        for (let i = 0; i < gameProps[difficulty].mines; i++) {
            const x = Math.floor(Math.random() * gameProps[difficulty].width);
            const y = Math.floor(Math.random() * gameProps[difficulty].height);

            if (field[y][x].value === 9) {
                i--;
            } else {
                field[y][x].value = 9;

                for (let i = 0; i <= 2; i++) {
                    const newY = y + Math.floor(Math.cos(Math.PI / 2 * i));
                    for (let j = 2; j >= 0; j--) {
                        const newX = x + Math.floor(Math.cos(Math.PI / 2 * j));
                        if ((newY >= 0 && newY <= gameProps[difficulty].height - 1) && (newX >= 0 && newX <= gameProps[difficulty].width - 1) && field[newY][newX].value !== 9) {
                            field[newY][newX].value += 1;
                        }
                    }
                }
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