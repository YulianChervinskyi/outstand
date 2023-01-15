import {GameField} from "./GameField";
import {ControlPanel} from "./ControlPanel";
import {ICell, ECellState, ECellValue, EDifficultyType, gameProps} from "./config";
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
            flagNumber: gameProps[EDifficultyType.Normal].mines,
            gameField: this.createGameField(EDifficultyType.Normal),
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

    resetGame = () => {
        this.counter = 0;
        this.isGameOn = false;
        this.stopTimer();
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
        const field: ICell[][] = Array<ICell[]>(gameProps[difficulty].height).fill(
            Array<ICell>(gameProps[difficulty].width).fill(
                {value: ECellValue.V0, state: ECellState.Open}
            )
        );
        return field;
    }

    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
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