import {ICell} from "../types";
import {Cell} from "./Cell";
import "./GameField.css";

interface IGameField {
    onCellOpen: (x: number, y: number) => void,
    onCellFlag: (x: number, y: number) => void,
    gameField: ICell[][],
}

export function GameField(props: IGameField) {
    const handleContextMenu = (x: number, y: number) => {
        props.onCellFlag(x, y);
    }

    const handleClick = (x: number, y: number) => {
        props.onCellOpen(x, y);
    }

    return (
        <div className="game-field">
            {props.gameField.map((row, y) =>
                <div className="game-field-row"
                     style={{height: 100 / props.gameField.length + "%"}}
                     key={y}>
                    {row.map((cell, x) =>
                        <div style={{width: 100 / row.length + "%"}} key={x}>
                            <Cell cell={cell}
                                  onClick={() => handleClick(x, y)}
                                  onContextMenu={() => handleContextMenu(x, y)}
                                  key={x}/>
                        </div>
                    )}
                </div>)
            }
        </div>
    );
}