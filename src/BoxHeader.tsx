import './BoxHeader.css';
import React from "react";

export interface IBoxHeaderProps {
    onMove: (pos: { x: number, y: number }) => void,
    onClose: () => void,
}

export function BoxHeader(props: IBoxHeaderProps) {
    //const [oldPos, setOldPos] = useState<{x: number, y: number} | undefined>(undefined);
    let oldPos:{x: number, y: number} | undefined = undefined;

    const handleMouseDown = (e: React.MouseEvent) => {
        // setOldPosPos({x: e.clientX, y: e.clientY});
        oldPos = {x: e.clientX, y: e.clientY};
        document.body.onmousemove = handleMouseMove;
        document.body.onmouseup = handleMouseUp;
    }

    const handleMouseUp = () => {
        // setOldPos(undefined);
        oldPos = undefined;
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (oldPos)
            props.onMove({x: e.clientX - oldPos.x, y: e.clientY - oldPos.y});
    }

    return (
        <div
            className="box-header"
            onMouseDown={handleMouseDown}
            // onMouseUp={handleMouseUp}
            // onMouseMove={handleMouseMove}
        />
    );
}