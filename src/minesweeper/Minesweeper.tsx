import {GameField} from "./GameField";
import {ControlPanel} from "./ControlPanel";
import {ECellState, EDifficultyType, gameProps, ICell} from "./config";
import React from "react";
import hahaha from "./assets/hahaha.mp3";

export interface IProps {
    width: number,
    height: number,
    text: string,
    onChange: (e: { text: string }) => void,
}

interface IState {
    difficulty: EDifficultyType,
    timer: number,
    flagNumber: number,
    gameField: ICell[][],
    gameOver: boolean,
}

let audio: HTMLAudioElement | undefined;

export class Minesweeper extends React.Component<IProps, IState> {
    intervalId: NodeJS.Timeout | undefined = undefined;
    isGameOn: boolean = false;
    counter: number = 0;

    constructor(props: IProps) {
        super(props);
        this.state = {
            difficulty: EDifficultyType.Medium,
            timer: 0,
            flagNumber: gameProps[EDifficultyType.Medium].mines,
            gameField: this.createGameField(EDifficultyType.Medium),
            gameOver: false,
        };
    }

    handleChangeDifficulty = (difficulty: EDifficultyType) => {
        this.resetGame(difficulty);
    }

    handleCellClick = (x: number, y: number, e: React.MouseEvent) => {
        if (e.type === 'click') {
            this.openCell(x, y);
        } else if (e.type === 'contextmenu') {
            this.flagCell(x, y, e);
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
                processCellsAround(x, y, (xx, yy) => incCellValue(field, xx, yy));
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

    resetGame = (difficulty: EDifficultyType) => {
        this.counter = 0;
        this.isGameOn = false;
        this.setState({
            difficulty: difficulty,
            timer: this.counter,
            flagNumber: gameProps[difficulty].mines,
            gameField: this.createGameField(difficulty),
            gameOver: false
        });

        this.stopTimer();
        stopSound();
    }


    componentWillUnmount() {
        this.stopTimer();
    }

    openCell(x: number, y: number) {
        const field = this.state.gameField;

        if (!field[y])
            return;

        const cell = field[y][x];
        if (cell?.state !== ECellState.Closed)
            return;

        field[y][x].state = ECellState.Open;
        this.setState({gameField: field});

        if (field[y][x].value === 9) {
            this.setState({gameOver: true});
            playSound(hahaha).catch(console.error);
        }

        if (field[y][x].value > 0)
            return;

        processCellsAround(x, y, (xx, yy) => this.openCell(xx, yy));
    }

    flagCell = (x: number, y: number, e: React.MouseEvent) => {
        const field = this.state.gameField;

        e.preventDefault();

        if (field[y][x].state === ECellState.Open)
            return;

        if (this.state.flagNumber === 0 && field[y][x].state === ECellState.Closed)
            return;

        field[y][x].state = (field[y][x].state === ECellState.Closed) ?
            ECellState.Flagged : ECellState.Closed;

        this.setState({
            gameField: field,
            flagNumber: field[y][x].state === ECellState.Flagged ?
                this.state.flagNumber - 1 : this.state.flagNumber + 1,
        });
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

                {this.state.gameOver && <div className="info-overlay">
                    Game Over
                    <div className="controls">
                        <button onClick={() => this.resetGame(this.state.difficulty)}>Restart</button>
                    </div>
                </div>}

            </div>
        );
    }
}

function incCellValue(field: ICell[][], x: number, y: number) {
    if (field[y] && field[y][x] && field[y][x].value !== 9) {
        field[y][x].value += 1;
    }
}

function processCellsAround(x: number, y: number, action: (x: number, y: number) => void) {
    for (let i = y - 1; i < y + 2; i++) {
        for (let j = x - 1; j < x + 2; j++) {
            action(j, i);
        }
    }
}

function playSound(file: string) {
    stopSound();
    audio = new Audio(file);
    return audio.play();
}

function stopSound() {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}
