import React, {useEffect, useState} from "react";
import {img} from "../assets";
import {ECellState, ICell} from "../types";
import "./GameField.css";

interface ICellProps {
    cell: ICell,
    onClick: () => void,
    onContextMenu: () => void,
}

export function Cell(props: ICellProps) {
    const [angle, setAngle] = useState(0);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        props.onContextMenu();
    }

    useEffect(() => {
        setAngle(Math.random() * 360);
    }, []);

    return (
        <div className="game-field-cell"
             style={{backgroundColor: props.cell.state === ECellState.Open ? "darkgray" : "#F0F0F0"}}
             onClick={props.onClick}
             onContextMenu={(e) => handleContextMenu(e)}
        >

            {props.cell.state === ECellState.Flagged && <img src={img.flag} alt=""/>}

            {props.cell.state === ECellState.Open && props.cell.value > 0 &&
                (props.cell.value > 8
                    ? <img src={img.mine} style={{transform: `rotate(${angle}deg)`}} alt=""/>
                    : props.cell.value)}
        </div>
    );
}