import {ICell, ECellState} from "../config";
import "./GameField.css";
import React from "react";

export interface ICellProps {
    cell: ICell,
    key: number,
    onClick: () => void,
    onContextMenu: (e: React.MouseEvent) => void,
}

export function Cell(props: ICellProps) {
    return (
        <button className="game-field-cell"
                style={{backgroundColor: props.cell.state === ECellState.Open ? "darkgray" : "buttonface"}}
                onClick={props.onClick}
                onContextMenu={(e) => props.onContextMenu(e)}
                key={props.key}
        >
            {props.cell.state === ECellState.Open && props.cell.value ||
                props.cell.state === ECellState.Flagged && "F"}
        </button>
    );
}