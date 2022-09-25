import './BoxHeader.css';
import React, {useState} from "react";

export interface IBoxHeaderProps {
    onMove: (pos: { x: number, y: number }) => void,
    onClose: () => void,
}

export function BoxHeader(props: IBoxHeaderProps) {
    const [oldPos, setOldPos] = useState<{x: number, y: number} | undefined>(undefined);

    const handleMouseDown = (e: React.MouseEvent) => {
        setOldPos({x: e.clientX, y: e.clientY});
    }

    const handleMouseUp = () => {
        setOldPos(undefined);
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (oldPos)
            props.onMove({x: e.clientX - oldPos.x, y: e.clientY - oldPos.y});
    }

    return (
        <div
            className="box-header"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
        />
    );
}