import {COLORS} from "./config";
import {PieceModel} from "./PieceModel";

export function Board(props: { activePiece: PieceModel | undefined, board: number[][] }) {
    const board = props.board.map(r => r.slice());

    if (props.activePiece) {
        const piece = props.activePiece;
        piece.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    board[y + piece.y][x + piece.x] = piece.color;
                }
            });
        });
    }

    return (
        <div className="tetris-board">
            {board.map((row, y) =>
                <div className="tetris-row" key={y}>
                    {row.map((cell, x) =>
                        <div className="tetris-cell"
                             key={x}
                             style={{backgroundColor: cell < 0 ? "black" : COLORS[cell]}}>
                        </div>)}
                </div>)}
        </div>
    );
}
