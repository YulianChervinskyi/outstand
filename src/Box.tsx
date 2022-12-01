import './Box.css';
import {useState} from "react";
import {Asteroids} from "./asteroids/Asteroids";
import {BoxHeader} from "./BoxHeader";
import {BoxResizer} from "./BoxResizer";
import {Calc} from "./calc/Calc";
import {Fpe} from "./fpe/Fpe";
import {NoteEditor} from "./NoteEditor";
import {Tetris} from "./tetris/Tetris";

export interface IComponentProps {
    text: string,
    onChange: (e: { text: string }) => void,
    width: number,
    height: number,
    active?: boolean,
}

export enum BoxType {
    Note = "Note",
    Calc = "Calc",
    Tetris = "Tetris",
    Fpe = "Fpe",
    Asteroids = "Asteroids",
}

interface BoxProps {
    x: number,
    y: number,
    width: number,
    height: number,
    active: boolean,
    text: string,
    onChange: (id: number, e: { text: string }) => void,
    onMove: (id: number, pos: { x: number, y: number }) => void,
    onClose: (id: number) => void,
    onResize: (id: number, size: { width: number, height: number }) => void,
    onActive: (id: number) => void,
    id: number,
    type: BoxType,
}

export function Box(props: BoxProps) {
    const [size, setSize] = useState({width: props.width, height: props.height});
    const [pos, setPos] = useState({x: props.x, y: props.y});

    const style = {
        left: pos.x,
        top: pos.y,
        width: size.width,
        height: size.height,
        zIndex: props.active ? 1 : 0,
        filter: props.active ? "none" : "grayscale(100%)",
    };

    const handleResize = (size: { width: number, height: number }) => {
        setSize(size);
        props.onResize(props.id, size);
    };

    const handleMove = (change: { x: number, y: number }) => {
        setPos({x: pos.x + change.x, y: pos.y + change.y});
        props.onMove(props.id, {x: pos.x + change.x, y: pos.y + change.y});
    };

    const handleMouseDown = () => {
        props.onActive(props.id);
    };

    const width = size.width - 10;
    const height = size.height - 24;

    return (
        <div className="box" style={style} onMouseDown={handleMouseDown}>
            <BoxHeader onClose={() => props.onClose(props.id)} onMove={handleMove} caption={props.type.toString()}/>

            {props.type === BoxType.Note
                && <NoteEditor text={props.text} onChange={(e) => props.onChange(props.id, e)}/>}

            {props.type === BoxType.Calc
                && <Calc width={width} height={height} text={props.text}
                         onChange={(e) => props.onChange(props.id, e)}/>}

            {props.type === BoxType.Tetris
                && <Tetris width={width} height={height} text={props.text} active={props.active}
                           onChange={(e) => props.onChange(props.id, e)}/>}

            {props.type === BoxType.Fpe
                && <Fpe width={width} height={height} text={props.text} active={props.active}
                        onChange={(e) => props.onChange(props.id, e)}/>}

            {props.type === BoxType.Asteroids
                && <Asteroids width={width} height={height} text={props.text} active={props.active}
                              onChange={(e) => props.onChange(props.id, e)}/>}

            <BoxResizer width={size.width} height={size.height} onResize={handleResize}/>
        </div>
    );
}
