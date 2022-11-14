import React, {useEffect} from "react";
import {Board} from "./Board";
import {BOARD_HEIGHT, BOARD_WIDTH, PIECES} from "./config";
import {Piece} from "./Piece";
import {PieceModel} from "./PieceModel";
import './Tetris.css';

let speed = 1000;
let handleTick: () => void | undefined;

function tick() {
    clearTimeout(timeoutId);
    handleTick?.();
    timeoutId = setTimeout(tick, speed);
}

let timeoutId = setTimeout(tick, speed);

function getRandomPiece() {
    const piece = PIECES[Math.floor(Math.random() * PIECES.length)];
    return new PieceModel({
        piece: piece,
        rotation: Math.floor(Math.random() * 4),
        x: Math.floor(BOARD_WIDTH / 2 - piece.shape.length / 2),
    });
}

export function Tetris(props: { width: number, height: number, text: string, onChange: (e: { text: string }) => void, }) {
    const [board, setBoard] = React.useState<number[][]>(Array(BOARD_HEIGHT).fill(Array(BOARD_WIDTH).fill(-1)));
    const [activePiece, setActivePiece] = React.useState<PieceModel>(getRandomPiece());
    const [nextPiece, setNextPiece] = React.useState<PieceModel>(getRandomPiece());
    const [score, setScore] = React.useState<number>(0);
    const [gameOver, setGameOver] = React.useState<boolean>(false);
    const [paused, setPaused] = React.useState<boolean>(false);
    const [level, setLevel] = React.useState<number>(0);
    const [lines, setLines] = React.useState<number>(0);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (gameOver || paused && e.key !== 'Escape')
            return;

        switch (e.key) {
            case "ArrowLeft":
                movePiece(-1, 0);
                break;
            case "ArrowRight":
                movePiece(1, 0);
                break;
            case "ArrowDown":
                movePiece(0, 1);
                break;
            case "ArrowUp":
                rotatePiece();
                break;
            case " ":
                dropPiece();
                break;
            case "Escape":
                setPaused(!paused);
        }
    }

    const movePiece = (dx: number, dy: number) => {
        let newPiece = new PieceModel({...activePiece, x: activePiece.x + dx, y: activePiece.y + dy});
        if (isValidPosition(newPiece))
            setActivePiece(newPiece);
    }

    const rotatePiece = () => {
        const r = {...activePiece, rotation: (activePiece.rotation + 1) % 4};
        for (const m of [r, {...r, x: r.x - 1}, {...r, x: r.x + 1}, {...r, x: r.x - 2}, {...r, x: r.x + 2}]) {
            let newPiece = new PieceModel(m);
            if (isValidPosition(newPiece)) {
                setActivePiece(newPiece);
                break;
            }
        }
    }

    const dropPiece = () => {
        let newPiece = new PieceModel(activePiece);
        while (true) {
            newPiece = new PieceModel({...newPiece, y: newPiece.y + 1});
            if (isValidPosition(newPiece))
                setActivePiece(newPiece);
            else
                break;
        }

        setTimeout(tick, 0);
    }

    const isValidPosition = (piece: PieceModel) => {
        let {x, y} = piece;
        let shape = piece.shape;

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] !== 0) {
                    let boardRow = y + row;
                    let boardCol = x + col;

                    if (boardRow < 0 || boardRow >= BOARD_HEIGHT || boardCol < 0 || boardCol >= BOARD_WIDTH)
                        return false;

                    if (board[boardRow][boardCol] !== -1)
                        return false;
                }
            }
        }
        return true;
    }

    useEffect(() => {
        setActivePiece(nextPiece);
        setNextPiece(getRandomPiece());
    }, []);

    handleTick = () => {
        if (gameOver || paused)
            return;

        let newPiece = new PieceModel({...activePiece, y: activePiece.y + 1});

        if (isValidPosition(newPiece)) {
            setActivePiece(newPiece);
        } else {
            if (activePiece.y === 0) {
                setGameOver(true);
            } else {
                addPieceToBoard();
                setActivePiece(nextPiece);
                setNextPiece(getRandomPiece());
            }
        }
    };

    const addPieceToBoard = () => {
        let newBoard = board.map(row => row.map(cell => cell));
        let newScore = score + 10;

        for (let row = 0; row < activePiece.shape.length; row++) {
            for (let col = 0; col < activePiece.shape[row].length; col++) {
                if (activePiece.shape[row][col] !== 0) {
                    newBoard[activePiece.y + row][activePiece.x + col] = activePiece.color;
                }
            }
        }

        const removedLines = checkLines(newBoard);

        if (removedLines > 0) {
            newScore += 100 * removedLines;
            setLines(lines + removedLines);

            if (Math.floor((lines + removedLines) / 10) > level) {
                setLevel(level + 1);
                speed *= 0.9;
            }
        }

        setScore(newScore);
        setBoard(newBoard);
    }

    const checkLines = (board: number[][]) => {
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

    const resetGame = () => {
        setBoard(Array(BOARD_HEIGHT).fill(Array(BOARD_WIDTH).fill(-1)));
        setScore(0);
        setGameOver(false);
        setPaused(false);
        setLevel(0);
        setLines(0);
        setActivePiece(getRandomPiece());
        setNextPiece(getRandomPiece());
        speed = 1000;
    }

    document.body.onkeydown = handleKeyDown;

    return (
        <div className="tetris">
            {paused && <div className="info-overlay">
                Paused
                <div className="controls">
                    <button onClick={() => setPaused(false)}>Continue</button>
                    <button onClick={resetGame}>Restart</button>
                </div>
            </div>}
            {gameOver && <div className="info-overlay">
                Game Over
                <div className="controls">
                    <button onClick={resetGame}>Restart</button>
                </div>
            </div>}
            <Board board={board} activePiece={activePiece}/>
            <div className="tetris-info">
                <div className="tetris-score">
                    <div className="title">Score</div>
                    <div className="value">{score}</div>
                </div>
                <div className="tetris-level">
                    <div className="title">Level</div>
                    <div className="value">{level}</div>
                </div>
                <div className="tetris-lines">
                    <div className="title">Lines</div>
                    <div className="value">{lines}</div>
                </div>
                <div className="tetris-next-piece">
                    <div className="title">Next</div>
                    <div className="value"><Piece piece={nextPiece}/></div>
                </div>
            </div>
        </div>
    );
}
