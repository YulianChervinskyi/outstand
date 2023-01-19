import {ECellState, ICell} from "./config";
import React from "react";
import "./GameField.css";

interface IGameField {
    onCellOpen: (x: number, y: number) => void,
    onCellFlag: (x: number, y: number) => void,
    gameField: ICell[][],
}

export function GameField(props: IGameField) {
    const handleContextMenu = (x: number, y: number, e: React.MouseEvent) => {
        e.preventDefault();
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
                        <button className="game-field-cell"
                                style={{
                                    width: 100 / row.length + "%",
                                    backgroundColor: cell.state === ECellState.Open ? "darkgray" : "buttonface"
                                }}
                                onClick={() => handleClick(x, y)}
                                onContextMenu={(e) => handleContextMenu(x, y, e)}
                                key={x}>
                            {cell.state === ECellState.Open && cell.value ||
                                cell.state === ECellState.Flagged && "F"}
                        </button>)}
                </div>)}
        </div>
    );
}