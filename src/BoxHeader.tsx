import './BoxHeader.css';
import React from "react";

export interface IBoxHeaderProps {
    onMove: (pos: { x: number, y: number }) => void,
    onClose: () => void,
}

export function BoxHeader(props: IBoxHeaderProps) {
    let oldPos: { x: number, y: number } | undefined = undefined;

    const handleMouseDown = (e: React.MouseEvent) => {
        oldPos = {x: e.clientX, y: e.clientY};

        document.body.onmousemove = handleMouseMove;
        document.body.onmouseup = handleMouseUp;
    }

    const handleMouseUp = () => {
        oldPos = undefined;
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (oldPos)
            props.onMove({x: e.clientX - oldPos.x, y: e.clientY - oldPos.y});
    }

    return (
        <div className="box-header">
            <div className="mover" onMouseDown={handleMouseDown}></div>
            <button className="close-button" onClick={props.onClose}>X</button>
        </div>
    );
}
