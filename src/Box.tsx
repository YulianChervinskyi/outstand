import './Box.css';
import React, {useState} from "react";
import {BoxHeader} from "./BoxHeader";
import {BoxResizer} from "./BoxResizer";
import {NoteEditor} from "./NoteEditor";

var currenZIndex = 0;

interface BoxProps {
    x: number,
    y: number,
    width: number,
    height: number,
    onChange: (e: { text: string }) => void,
    onMove: (pos: { x: number, y: number }) => void,
    onClose: (id: number) => void,
    onResize: (size: { width: number, height: number }) => void,
    onActive: (id: number) => void,
    id: number,
}

export function Box(props: BoxProps) {
    const [size, setSize] = useState({width: props.width, height: props.height});
    const [pos, setPos] = useState({x: props.x, y: props.y});
    const [zIndex, setZIndex] = useState(0);

    const style = {
        left: pos.x,
        top: pos.y,
        width: size.width,
        height: size.height,
        zIndex: zIndex,
    };

    const handleResize = (size: { width: number, height: number }) => {
        setSize(size);
    }

    const handleMove = (change: { x: number, y: number }) => {
        setPos({x: pos.x + change.x, y: pos.y + change.y});
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        props.onActive(props.id);
        setZIndex(++currenZIndex);
    }

    return (
        <div className="box" style={style} onClick={handleClick}>
            <BoxHeader onClose={() => props.onClose(props.id)} onMove={handleMove}/>
            <NoteEditor onChange={props.onChange}/>
            <BoxResizer width={size.width} height={size.height} onResize={handleResize}/>
        </div>
    );
}
