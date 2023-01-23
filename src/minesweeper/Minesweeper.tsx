import {IComponentProps} from "../Box";
import {GameField} from "./GameField";
import {ControlPanel} from "./ControlPanel";
import {ECellState, EDifficultyType, gameProps, ICell} from "./config";
import React from "react";
import laugh from "./assets/hahaha.mp3";
import victory from "./assets/victorySound.mp3";

interface IState {
    timer: number,
    flagNumber: number,
    gameEndText: string,
    cellsCounter: number,
    difficulty: EDifficultyType,
    gameField: ICell[][],
    gameOver: boolean,
}

let audio: HTMLAudioElement | undefined;

export class Minesweeper extends React.Component<IComponentProps, IState> {
    intervalId: NodeJS.Timeout | undefined;
    cellsCounter = 0;
    timerCounter = 0;
    isGameStarted = false;

    constructor(props: IComponentProps) {
        super(props);
        const data = JSON.parse(this.props.text || '{}') as IState;
        const difficultyProps = gameProps[EDifficultyType.Medium];

        this.cellsCounter = data?.cellsCounter || difficultyProps.height * difficultyProps.width - difficultyProps.mines;
        this.timerCounter = data?.timer || 0;

        this.state = {
            timer: this.timerCounter,
            gameOver: data?.gameOver || false,
            gameEndText: data?.gameEndText || "",
            difficulty: data?.difficulty || EDifficultyType.Medium,
            flagNumber: data?.flagNumber || difficultyProps.mines,
            gameField: data?.gameField || this.createGameField(EDifficultyType.Medium),
            cellsCounter: this.cellsCounter,
        };

        this.setMinSize(this.state.difficulty);
    }

    setState<K extends keyof IState>(state: Pick<IState, K> | IState | null) {
        super.setState(state, () => {
            this.props.onChange({text: JSON.stringify(this.state)});
        });
    }

    componentWillUnmount() {
        this.stopTimer();
        stopSound();
    }

    private handleChangeDifficulty = (difficulty: EDifficultyType) => {
        this.setMinSize(difficulty);
        this.resetGame(difficulty);
    }

    private setMinSize(difficulty: EDifficultyType) {
        const factor = 20;
        this.props.onChangeMinSize({w: gameProps[difficulty].width * factor, h: gameProps[difficulty].height * factor});
    }

    private handleCellOpen = (x: number, y: number) => {
        this.startGame();
        this.openCell(x, y);
    }

    private handleCellFlag = (x: number, y: number) => {
        this.startGame();
        this.flagCell(x, y);
    }

    private startGame = () => {
        if (this.isGameStarted)
            return;

        this.isGameStarted = true;

        this.intervalId = setInterval(() => {
            if (this.timerCounter === 999) {
                this.stopTimer();
                return;
            }
            this.timerCounter++;
            this.setState({timer: this.timerCounter});
        }, 1000);
    }

    private createGameField = (difficulty: EDifficultyType) => {
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

    private stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }

    private resetGame = (difficulty: EDifficultyType) => {
        this.timerCounter = 0;
        this.isGameStarted = false;
        this.cellsCounter = gameProps[difficulty].height * gameProps[difficulty].width - gameProps[difficulty].mines;
        this.setState({
            timer: this.timerCounter,
            difficulty: difficulty,
            cellsCounter: this.cellsCounter,
            flagNumber: gameProps[difficulty].mines,
            gameField: this.createGameField(difficulty),
            gameOver: false
        });
        this.stopTimer();
        stopSound();
    }

    private openCell(x: number, y: number) {
        const field = this.state.gameField;

        if (!field[y])
            return;

        const cell = field[y][x];
        if (cell?.state !== ECellState.Closed)
            return;

        this.cellsCounter--;
        field[y][x].state = ECellState.Open;
        this.setState({gameField: field, cellsCounter: this.cellsCounter});

        if (field[y][x].value === 9)
            this.gameOver();
        else if (this.cellsCounter === 0)
            this.victory();

        if (field[y][x].value > 0)
            return;

        processCellsAround(x, y, (xx, yy) => this.openCell(xx, yy));
    }

    private flagCell = (x: number, y: number) => {
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

    private showAllMines = () => {
        const field = this.state.gameField;
        const height = gameProps[this.state.difficulty].height;
        const width = gameProps[this.state.difficulty].width;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (field[y][x].value === 9)
                    field[y][x].state = ECellState.Open;
            }
        }
    }

    private gameOver = () => {
        this.showAllMines();
        this.stopTimer();
        playSound(laugh).catch(console.error);
        this.setState({gameOver: true, gameEndText: "Game over!"});
    }

    private victory = () => {
        this.stopTimer();
        playSound(victory).catch(console.error);
        this.setState({gameOver: true, gameEndText: "Victory!"});
    }

    render() {
        return (
            <div className="minesweeper"
                 style={{width: this.props.width, height: this.props.height, backgroundColor: "#819462"}}>
                <ControlPanel
                    timer={this.state.timer}
                    flagNumber={this.state.flagNumber}
                    difficulty={this.state.difficulty}
                    changeDifficulty={this.handleChangeDifficulty}
                />
                <GameField
                    onCellOpen={this.handleCellOpen}
                    onCellFlag={this.handleCellFlag}
                    gameField={this.state.gameField}
                />

                {this.state.gameOver && <div className="info-overlay">
                    {this.state.gameEndText}
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
