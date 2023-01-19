import {GameField} from "./GameField";
import {ControlPanel} from "./ControlPanel";
import {ECellState, EDifficultyType, gameProps, ICell} from "./config";
import React from "react";
import laugh from "./assets/hahaha.mp3";
import victory from "./assets/victorySound.mp3";

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
    gameOver: boolean,
}

let audio: HTMLAudioElement | undefined;

export class Minesweeper extends React.Component<IProps, IState> {
    difficulty: EDifficultyType = EDifficultyType.Medium;
    intervalId: NodeJS.Timeout | undefined = undefined;
    winCounter: number = gameProps[this.difficulty].height * gameProps[this.difficulty].width;
    gameEndText: string = "";
    timerCounter: number = 0;
    isGameStarted: boolean = false;

    constructor(props: IProps) {
        super(props);
        this.state = {
            timer: 0,
            flagNumber: gameProps[this.difficulty].mines,
            gameField: this.createGameField(this.difficulty),
            gameOver: false,
        };
    }

    handleChangeDifficulty = (difficulty: EDifficultyType) => {
        this.resetGame(difficulty);
    }

    handleCellOpen = (x: number, y: number) => {
        this.openCell(x, y);
        this.startGame();
    }

    handleCellFlag = (x: number, y: number) => {
        this.flagCell(x, y);
        this.startGame();
    }

    startGame = () => {
        if (this.isGameStarted)
            return;

        this.isGameStarted = true;

        this.intervalId = setInterval(() => {
            this.timerCounter++;
            this.setState({timer: this.timerCounter});
            if (this.timerCounter === 999)
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
        this.timerCounter = 0;
        this.isGameStarted = false;
        this.difficulty = difficulty;
        this.winCounter = gameProps[this.difficulty].height * gameProps[this.difficulty].width;
        this.setState({
            timer: this.timerCounter,
            flagNumber: gameProps[difficulty].mines,
            gameField: this.createGameField(difficulty),
            gameOver: false
        });

        this.stopTimer();
        stopSound();
    }


    componentWillUnmount() {
        this.stopTimer();
        stopSound();
    }

    openCell(x: number, y: number) {
        const field = this.state.gameField;

        if (!field[y])
            return;

        const cell = field[y][x];
        if (cell?.state !== ECellState.Closed)
            return;

        this.winCounter--;
        field[y][x].state = ECellState.Open;
        this.setState({gameField: field});

        if (field[y][x].value === 9)
            this.gameOver();

        if (this.winCounter === gameProps[this.difficulty].mines)
            this.victory();

        if (field[y][x].value > 0)
            return;

        processCellsAround(x, y, (xx, yy) => this.openCell(xx, yy));
    }

    flagCell = (x: number, y: number) => {
        const field = this.state.gameField;

        if (field[y][x].state === ECellState.Open)
            return;

        if (this.state.flagNumber === 0 && field[y][x].state === ECellState.Closed)
            return;

        field[y][x].state = field[y][x].state === ECellState.Closed
            ? ECellState.Flagged
            : ECellState.Closed;

        this.setState({
            gameField: field,
            flagNumber: this.state.flagNumber + (field[y][x].state !== ECellState.Flagged ? 1 : -1),
        });
    }

    showAllMines = () => {
        const field = this.state.gameField;
        const height = gameProps[this.difficulty].height;
        const width = gameProps[this.difficulty].width;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (field[y][x].value === 9)
                    field[y][x].state = ECellState.Open;
            }
        }
    }

    gameOver = () => {
        this.gameEndText = "Game over";
        this.showAllMines();
        this.stopTimer();
        playSound(laugh).catch(console.error);
        this.setState({gameOver: true});
    }

    victory = () => {
        this.gameEndText = "Victory!";
        this.stopTimer();
        playSound(victory).catch(console.error);
        this.setState({gameOver: true});
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
                    onCellOpen={this.handleCellOpen}
                    onCellFlag={this.handleCellFlag}
                    gameField={this.state.gameField}
                />

                {this.state.gameOver && <div className="info-overlay">
                    {this.gameEndText}
                    <div className="controls">
                        <button onClick={() => this.resetGame(this.difficulty)}>Restart</button>
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
