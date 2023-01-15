import "./GameField.css";
import {ICell, ECellState} from "./config";

interface IGameField {
    onCellClick: () => void,
    gameField: ICell[][],
}

export function GameField(props: IGameField) {
    const handleClick = () => {
         props.onCellClick();
    }

    return (
        <div className="game-field">
            {props.gameField.map((row, rowKey) =>
                <div className="game-field-row"
                     style={{height: 100 / props.gameField.length + "%"}}
                     key={rowKey}>
                    {row.map((cell, cellKey) =>
                        <button className="game-field-cell"
                                style={{width: 100 / row.length + "%"}}
                                onClick={handleClick}
                                key={cellKey}>
                            {cell.state === ECellState.Open && cell.value ||
                                cell.state === ECellState.Flagged && "F"}
                        </button>)}
                </div>)}
        </div>
    );
}