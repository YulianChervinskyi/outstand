import "./GameField.css";
import {ICell, ECellState} from "./config";

interface IGameField {
    gameStarted: () => void,
    gameField: ICell[][],
    isGameOn: boolean,
}

export function GameField(props: IGameField) {
    const handleClick = () => {
        if (!props.isGameOn)
            props.gameStarted();
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