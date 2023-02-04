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
             style={{
                 backgroundColor: props.cell.state === ECellState.Open ? "darkgray" : "#F0F0F0",
                 ...props.cell.value > 0 && props.cell.value < 9 && props.cell.state === ECellState.Open ? {
                     color: mixRgbColors("rgb(78, 11, 124)", "rgb(253,80,13)", props.cell.value / 8),
                 } : {},
             }}
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

function mixRgbColors(from: string, to: string, percent: number) {
    const f = from.split(",");
    const fR = parseInt(f[0].slice(4));
    const fG = parseInt(f[1]);
    const fB = parseInt(f[2]);

    const t = to.split(",");
    const tR = parseInt(t[0].slice(4));
    const tG = parseInt(t[1]);
    const tB = parseInt(t[2]);

    return "rgb(" +
        (Math.round((tR - fR) * percent) + fR) + "," +
        (Math.round((tG - fG) * percent) + fG) + "," +
        (Math.round((tB - fB) * percent) + fB) + ")";
}