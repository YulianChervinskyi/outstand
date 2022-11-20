import React from "react";
import {Board} from "./Board";
import {BOARD_HEIGHT, BOARD_WIDTH, SHAPES} from "./config";
import {Piece} from "./Piece";
import {IPiece, PieceModel} from "./PieceModel";
import './Tetris.css';

function getRandomPiece(): IPiece {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return {
        shape,
        rotation: Math.floor(Math.random() * 4),
        x: Math.floor(BOARD_WIDTH / 2 - shape.body.length / 2),
        y: 0,
    };
}

interface IProps {
    width: number,
    height: number,
    text: string,
    onChange: (e: { text: string }) => void,
    active?: boolean,
}

interface IState {
    board: number[][];
    activePiece: IPiece,
    nextPiece: IPiece,
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
        this.state = this.props.text ? JSON.parse(this.props.text) : initialState;
        document.body.addEventListener("keydown", this.handleKeyDown);
        this.tick();
    }

    tick = () => {
        clearTimeout(this.timeoutId);
        this.handleTick();
        this.timeoutId = setTimeout(this.tick, this.state.speed);
    }

    handleKeyDown = (e: KeyboardEvent) => {
        if (!this.props.active || this.state.gameOver || this.state.paused && e.key !== 'Escape')
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
        const activePiece = this.state.activePiece;
        let newPiece = {...activePiece, x: activePiece.x + dx, y: activePiece.y + dy};
        if (this.isValidPosition(newPiece))
            this.setState({activePiece: newPiece});
    }

    rotatePiece = () => {
        const activePiece = this.state.activePiece;
        const r = {...activePiece, rotation: (activePiece.rotation + 1) % 4};
        for (const m of [r, {...r, x: r.x - 1}, {...r, x: r.x + 1}, {...r, x: r.x - 2}, {...r, x: r.x + 2}]) {
            if (this.isValidPosition(m)) {
                this.setState({activePiece: m});
                break;
            }
        }
    }

    dropPiece = () => {
        const activePiece = this.state.activePiece;
        let y = this.state.activePiece.y;
        while (true) {
            if (!this.isValidPosition({...activePiece, y: ++y}))
                break;
        }
        this.setState({activePiece: {...activePiece, y: y - 1}});
        setTimeout(this.tick, 0);
    }

    isValidPosition = (piece: IPiece) => {
        let {x, y} = piece;
        let shape = new PieceModel(piece).shape;

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

        let newPiece = {...s.activePiece, y: s.activePiece.y + 1};

        if (this.isValidPosition(newPiece)) {
            this.setState({activePiece: newPiece});
        } else {
            if (s.activePiece.y === 0) {
                this.setState({gameOver: true});
            } else {
                this.addPieceToBoard();
                this.setState({activePiece: s.nextPiece, nextPiece: getRandomPiece()});
            }
        }
    };

    addPieceToBoard = () => {
        const s = this.state;
        let newBoard = s.board.map(row => row.map(cell => cell));
        let newScore = s.score + 10;
        let shape = new PieceModel(s.activePiece).shape;

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] !== 0) {
                    newBoard[s.activePiece.y + row][s.activePiece.x + col] = s.activePiece.shape.color;
                }
            }
        }

        const removedLines = this.checkLines(newBoard);

        if (removedLines > 0) {
            newScore += 100 * removedLines;
            this.setState({lines: s.lines + removedLines});

            if (Math.floor((s.lines + removedLines) / 10) > s.level) {
                this.setState({level: s.level + 1, speed: s.speed * 0.9});
            }
        }

        this.setState({score: newScore, board: newBoard});
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

    setState<K extends keyof IState>(state: Pick<IState, K> | IState | null) {
        super.setState(state, () => {
            console.log(this.state);
            this.props.onChange({text: JSON.stringify(this.state)});
        });
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
                <Board board={s.board} activePiece={new PieceModel(s.activePiece)}/>
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
                        <div className="value"><Piece piece={new PieceModel(s.nextPiece)}/></div>
                    </div>
                </div>
            </div>
        );
    }
}
