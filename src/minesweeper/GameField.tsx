import "./GameField.css";
import {cell, cellState} from "./config";

interface IGameField {
    gameStarted: (isGameStarted: boolean) => void,
    gameField: cell[][],
}

export function GameField(props: IGameField) {

    return (
        <div className="game-field">
            {props.gameField.map((row, rowKey) =>
                <div className="game-field-row" style={{height: 100 / props.gameField.length + "%"}} key={rowKey}>
                    {row.map((cell, cellKey) =>
                        <button className="game-field-cell" style={{width: 100 / row.length + "%"}} key={cellKey}>
                            {cell.state === cellState.Open && cell.value ||
                                cell.state === cellState.Flagged && "F"}
                        </button>)}
                </div>)}
        </div>
    );
}