import './Box.css';
import {BoxHeader} from "./BoxHeader";
import {BoxResizer} from "./BoxResizer";
import {NoteEditor} from "./NoteEditor";
import React, {useState} from "react";

interface BoxProps {
    x: number,
    y: number,
    width: number | 'auto',
    height: number,
    onChange: (e: { text: string }) => void,
    onMove: (pos: { x: number, y: number }) => void,
    onClose: () => void,
    onResize: (size: { width: number, height: number }) => void,
}

export function Box(props: BoxProps) {
    const [pos, setPos] = useState({x: 0, y: 0});

    const style = {
        left: props.x + pos.x,
        top: props.y + pos.y,
        width: props.width,
        height: props.height,
    };

    const handleMove = (change: { x: number, y: number }) => {
        setPos({x:change.x, y:change.y});
    };

    return (
        <div className="box" style={style} onClick={(e) => e.stopPropagation()}>
            <BoxHeader onClose={props.onClose} onMove={handleMove}/>
            <NoteEditor onChange={props.onChange}/>
            <BoxResizer onResize={props.onResize}/>
        </div>
    );
}
