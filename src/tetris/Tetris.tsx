import React from "react";
import {Board} from "./Board";
import {BOARD_HEIGHT, BOARD_WIDTH, PIECES} from "./config";
import {Piece} from "./Piece";
import {PieceModel} from "./PieceModel";
import './Tetris.css';

function getRandomPiece() {
    const piece = PIECES[Math.floor(Math.random() * PIECES.length)];
    return new PieceModel({
        piece: piece,
        rotation: Math.floor(Math.random() * 4),
        x: Math.floor(BOARD_WIDTH / 2 - piece.shape.length / 2),
    });
}

interface IProps {
    width: number,
    height: number,
    text: string,
    onChange: (e: { text: string }) => void,
}

interface IState {
    board: number[][];
    activePiece: PieceModel,
    nextPiece: PieceModel,
    score: number,
    lines: number,
    level: number,
    gameOver: boolean,
    paused: boolean,
    speed: number,
}

const initialState = {
    board: Array(BOARD_HEIGHT).fill(Array(BOARD_WIDTH).fill(-1)),
    activePiece: getRandomPiece(),
    nextPiece: getRandomPiece(),
    score: 0,
    lines: 0,
    level: 0,
    gameOver: false,
    paused: false,
    speed: 1000,
}

export class Tetris extends React.Component<IProps, IState> {
    private timeoutId?: NodeJS.Timeout;

    constructor(props: IProps) {
        super(props);
        this.state = initialState;
        document.body.onkeydown = this.handleKeyDown;
        this.tick();
    }

    tick = () => {
        clearTimeout(this.timeoutId);
        this.handleTick();
        this.timeoutId = setTimeout(this.tick, this.state.speed);
    }

    handleKeyDown = (e: KeyboardEvent) => {
        if (this.state.gameOver || this.state.paused && e.key !== 'Escape')
            return;

        switch (e.key) {
            case "ArrowLeft":
                this.movePiece(-1, 0);
                break;
            case "ArrowRight":
                this.movePiece(1, 0);
                break;
            case "ArrowDown":
                this.movePiece(0, 1);
                break;
            case "ArrowUp":
                this.rotatePiece();
                break;
            case " ":
                this.dropPiece();
                break;
            case "Escape":
                this.setState({...this.state, paused: !this.state.paused});
        }
    }

    movePiece = (dx: number, dy: number) => {
        const s = this.state;
        let newPiece = new PieceModel({...s.activePiece, x: s.activePiece.x + dx, y: s.activePiece.y + dy});
        if (this.isValidPosition(newPiece))
            this.setState({...s, activePiece: newPiece});
    }

    rotatePiece = () => {
        const s = this.state;
        const r = {...s.activePiece, rotation: (s.activePiece.rotation + 1) % 4};
        for (const m of [r, {...r, x: r.x - 1}, {...r, x: r.x + 1}, {...r, x: r.x - 2}, {...r, x: r.x + 2}]) {
            let newPiece = new PieceModel(m);
            if (this.isValidPosition(newPiece)) {
                this.setState({...s, activePiece: newPiece});
                break;
            }
        }
    }

    dropPiece = () => {
        const s = this.state;
        let y = this.state.activePiece.y;
        while (true) {
            let newPiece = new PieceModel({...s.activePiece, y: ++y});
            if (!this.isValidPosition(newPiece))
                break;
        }
        this.setState({...s, activePiece: new PieceModel({...s.activePiece, y: y - 1})});
        setTimeout(this.tick, 0);
    }

    isValidPosition = (piece: PieceModel) => {
        let {x, y} = piece;
        let shape = piece.shape;

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] !== 0) {
                    let boardRow = y + row;
                    let boardCol = x + col;

                    if (boardRow < 0 || boardRow >= BOARD_HEIGHT || boardCol < 0 || boardCol >= BOARD_WIDTH)
                        return false;

                    if (this.state.board[boardRow][boardCol] !== -1)
                        return false;
                }
            }
        }
        return true;
    }

    handleTick = () => {
        const s = this.state;
        if (s.gameOver || s.paused)
            return;

        let newPiece = new PieceModel({...s.activePiece, y: s.activePiece.y + 1});

        if (this.isValidPosition(newPiece)) {
            this.setState({...s, activePiece: newPiece});
        } else {
            if (s.activePiece.y === 0) {
                this.setState({...s, gameOver: true});
            } else {
                this.addPieceToBoard(s);
                this.setState({...s, activePiece: s.nextPiece, nextPiece: getRandomPiece()});
            }
        }
    };

    addPieceToBoard = (s: IState) => {
        let newBoard = s.board.map(row => row.map(cell => cell));
        let newScore = s.score + 10;

        for (let row = 0; row < s.activePiece.shape.length; row++) {
            for (let col = 0; col < s.activePiece.shape[row].length; col++) {
                if (s.activePiece.shape[row][col] !== 0) {
                    newBoard[s.activePiece.y + row][s.activePiece.x + col] = s.activePiece.color;
                }
            }
        }

        const removedLines = this.checkLines(newBoard);

        if (removedLines > 0) {
            newScore += 100 * removedLines;
            s.lines += removedLines;

            if (Math.floor((s.lines + removedLines) / 10) > s.level) {
                s.level++;
                s.speed *= 0.9;
            }
        }

        s.score = newScore;
        s.board = newBoard;
    }

    checkLines = (board: number[][]) => {
        let removedLines = 0;

        for (let row = 0; row < BOARD_HEIGHT; row++) {
            let isFull = true;

            for (let col = 0; col < BOARD_WIDTH; col++) {
                if (board[row][col] === -1) {
                    isFull = false;
                    break;
                }
            }

            if (isFull) {
                board.splice(row, 1);
                board.unshift(Array(BOARD_WIDTH).fill(-1));
                removedLines++;
            }
        }
        return removedLines;
    }

    resetGame = () => {
        this.setState(initialState);
    }

    render() {
        const s = this.state;
        return (
            <div className="tetris">
                {s.paused && <div className="info-overlay">
                    Paused
                    <div className="controls">
                        <button onClick={() => this.setState({...s, paused: false})}
                        >Continue
                        </button>
                        <button onClick={this.resetGame}>Restart</button>
                    </div>
                </div>}
                {s.gameOver && <div className="info-overlay">
                    Game Over
                    <div className="controls">
                        <button onClick={this.resetGame}>Restart</button>
                    </div>
                </div>}
                <Board board={s.board} activePiece={s.activePiece}/>
                <div className="tetris-info">
                    <div className="tetris-score">
                        <div className="title">Score</div>
                        <div className="value">{s.score}</div>
                    </div>
                    <div className="tetris-level">
                        <div className="title">Level</div>
                        <div className="value">{s.level}</div>
                    </div>
                    <div className="tetris-lines">
                        <div className="title">Lines</div>
                        <div className="value">{s.lines}</div>
                    </div>
                    <div className="tetris-next-piece">
                        <div className="title">Next</div>
                        <div className="value"><Piece piece={s.nextPiece}/></div>
                    </div>
                </div>
            </div>
        );
    }
}
