import {cellFlag, cellMine, ECellState, ICell} from "../config";
import "./GameField.css";
import React, {useState} from "react";

interface ICellProps {
    cell: ICell,
    key: number,
    onClick: () => void,
    onContextMenu: () => void,
}

export function Cell(props: ICellProps) {
    const angle = useState(Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1));

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        props.onContextMenu();
    }

    return (
        <div className="game-field-cell"
             style={{backgroundColor: props.cell.state === ECellState.Open ? "darkgray" : "#F0F0F0"}}
             onClick={props.onClick}
             onContextMenu={(e) => handleContextMenu(e)}
             key={props.key}>

            {props.cell.state === ECellState.Flagged && <img src={cellFlag} alt=""/>}

            {props.cell.state === ECellState.Open && props.cell.value > 0 &&
                (props.cell.value > 8
                    ? <img src={cellMine} style={{transform: `rotate(${angle}deg)`}} alt=""/>
                    : props.cell.value)}
        </div>
    );
}