import "./GameField.css";
import {ICell, ECellState} from "./config";

interface IGameField {
    onCellClick: (x: number, y: number) => void,
    gameField: ICell[][],
}

export function GameField(props: IGameField) {
    const handleClick = (x: number, y: number) => {
        props.onCellClick(x, y);
    }

    return (
        <div className="game-field">
            {props.gameField.map((row, y) =>
                <div className="game-field-row"
                     style={{height: 100 / props.gameField.length + "%"}}
                     key={y}>
                    {row.map((cell, x) =>
                        <button className="game-field-cell"
                                style={{width: 100 / row.length + "%"}}
                                onClick={() => handleClick(x,y)}
                                key={x}>
                            {cell.state === ECellState.Open && cell.value ||
                                cell.state === ECellState.Flagged && "F"}
                        </button>)}
                </div>)}
        </div>
    );
}