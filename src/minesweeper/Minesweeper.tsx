import React from "react";
import {IComponentProps} from "../Box";
import {snd} from "./assets";
import {gameProps} from "./config";
import {ControlPanel} from "./control_panel/ControlPanel";
import {DifficultySelector} from "./difficulty_selector/DifficultySelector";
import {GameField} from "./game_field/GameField";
import {ECellState, EDifficultyType, ICell} from "./types";

interface IState {
    timer: number,
    flagNumber: number,
    cellsCounter: number,
    difficulty: EDifficultyType,
    isDifficultySelector: boolean,
    gameField: ICell[][],
    gamePause: boolean,
    gameOver: boolean,
    victory: boolean,
}

let audio: HTMLAudioElement | undefined;

export class Minesweeper extends React.Component<IComponentProps, IState> {
    intervalId: NodeJS.Timeout | undefined;
    isGameStarted = false;
    cellsCounter = 0;
    timerCounter = 0;

    constructor(props: IComponentProps) {
        super(props);
        const data = JSON.parse(this.props.text || '{}') as IState;
        const difficultyProps = gameProps[EDifficultyType.Easy];

        this.cellsCounter = data?.cellsCounter || difficultyProps.height * difficultyProps.width - difficultyProps.mines;
        this.timerCounter = data?.timer || 0;

        this.state = {
            timer: this.timerCounter,
            gamePause: data?.gamePause || false,
            gameOver: data?.gameOver || false,
            isDifficultySelector: data?.isDifficultySelector || false,
            difficulty: data?.difficulty || EDifficultyType.Easy,
            flagNumber: data?.flagNumber || difficultyProps.mines,
            gameField: data?.gameField || this.createGameField(EDifficultyType.Easy),
            cellsCounter: this.cellsCounter,
            victory: data?.victory || false,
        };

        this.setMinSize(this.state.difficulty);
        console.log("created minesweeper");
    }

    setState<K extends keyof IState>(state: Pick<IState, K> | IState | null) {
        super.setState(state, () => {
            this.props.onChange({text: JSON.stringify(this.state)});
        });
    }

    componentDidMount() {
        document.body.addEventListener("keydown", this.handleKeyDown);
    }

    componentDidUpdate(prevProps: Readonly<IComponentProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (this.state.gamePause || this.state.gameOver || this.state.isDifficultySelector)
            return;

        if (prevProps.active && !this.props?.active)
            this.pauseGame();
    }

    componentWillUnmount() {
        document.body.removeEventListener("keydown", this.handleKeyDown);
        this.stopTimer();
        stopSound();
    }

    private handleKeyDown = (e: KeyboardEvent) => {
        if (!this.props.active || this.state.gameOver || this.state.isDifficultySelector)
            return;

        if (e.key !== 'Escape')
            return;

        this.pauseGame();
    }

    private pauseGame = () => {
        if (!this.state.gamePause)
            this.stopTimer();
        else
            this.startTimer();

        this.setState({gamePause: !this.state.gamePause});
    }

    private handleContinue = () => {
        this.startTimer();
        this.setState({gamePause: false});
    }

    private handleChangeDifficulty = (difficulty: EDifficultyType) => {
        this.setMinSize(difficulty);
        this.resetGame(difficulty);
    }

    private setMinSize(difficulty: EDifficultyType) {
        const factor = 20;
        this.props.onChangeGeometry({
            minSize: {w: gameProps[difficulty].width * factor, h: gameProps[difficulty].height * factor},
            aspectRatio: {w: gameProps[difficulty].width, h: gameProps[difficulty].height},
        });
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

        this.startTimer();
    }

    private startTimer = () => {
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
            isDifficultySelector: false,
            gameField: this.createGameField(difficulty),
            gameOver: false,
            gamePause: false,
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
            this.loseGame();
        else if (this.cellsCounter === 0)
            this.winGame();

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
                if (field[y][x].state !== ECellState.Flagged && field[y][x].value === 9)
                    field[y][x].state = ECellState.Open;
            }
        }
    }

    private winGame = () => {
        playSound(snd.victory).catch(console.error);
        this.setState({victory: true, gameOver: true});
        this.stopTimer();
    }

    private loseGame = () => {
        this.showAllMines();
        playSound(snd.losing).catch(console.error);
        this.setState({victory: false, gameOver: true});
        this.stopTimer();
    }

    render() {
        return (
            <div className="minesweeper"
                 style={{
                     width: this.props.width,
                     height: this.props.height,
                     fontSize: Math.min(this.props.height * 0.05, this.props.width * 0.05),
                 }}>

                <ControlPanel
                    timer={this.state.timer}
                    flagNumber={this.state.flagNumber}
                    difficulty={this.state.difficulty}
                    openDifficultySelector={() => this.setState({isDifficultySelector: true})}
                />

                <GameField
                    onCellOpen={this.handleCellOpen}
                    onCellFlag={this.handleCellFlag}
                    gameField={this.state.gameField}
                />

                {this.state.gamePause && <div className="info-overlay">
                    Paused
                    <div className="controls">
                        <button onClick={this.handleContinue}>Continue</button>
                        <button onClick={() => this.resetGame(this.state.difficulty)}>Restart</button>
                    </div>
                </div>}

                {this.state.gameOver && <div className="info-overlay">
                    {this.state.victory ? "Victory!" : "Game over!"}
                    <div className="controls">
                        <button onClick={() => this.resetGame(this.state.difficulty)}>Restart</button>
                    </div>
                </div>}

                {this.state.isDifficultySelector && <DifficultySelector
                    onClose={() => this.setState({isDifficultySelector: false})}
                    onChangeDifficulty={this.handleChangeDifficulty}
                    width={this.props.width}
                    height={this.props.height}
                />}
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