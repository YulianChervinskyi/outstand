import {ICell} from "./config";
import React from "react";
import "./GameField.css";
import {Cell} from "./Cell";

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
                        <div style={{width: 100 / row.length + "%"}}>
                            <Cell
                                cell={cell}
                                onClick={() => handleClick(x, y)}
                                onContextMenu={(e) => handleContextMenu(x, y, e)}
                                key={x}
                            />
                        </div>
                    )}
                </div>)
            }
        </div>
    );
}