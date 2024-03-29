import './Box.scss';
import {useState} from "react";
import {Asteroids} from "./asteroids/Asteroids";
import {BoxHeader} from "./BoxHeader";
import {BoxResizer} from "./BoxResizer";
import {Calc} from "./calc/Calc";
import {Fpe} from "./fpe/Fpe";
import {NoteEditor} from "./note_editor/NoteEditor";
import {Tetris} from "./tetris/Tetris";
import {Minesweeper} from "./minesweeper/Minesweeper";
import {Bomberman} from "./bomberman/Bomberman";
import {Fpb} from "./fpb/Fpb";
import {Drive} from "./drive/Drive";

export interface ISize {
    w: number,
    h: number,
}

export interface IGeometry {
    minSize?: ISize,
    aspectRatio?: ISize,
}

export interface IComponentProps {
    text: string,
    onChange: (e: { text: string }) => void,
    onChangeGeometry: (e: IGeometry) => void,
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
    Minesweeper = "Minesweeper",
    Bomberman = "Bomberman",
    Fpb = "Fpb",
    Drive = "Drive",
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
    onResize: (id: number, size: { w: number, h: number }) => void,
    onActive: (id: number) => void,
    id: number,
    type: BoxType,
}

export function Box(props: BoxProps) {
    const [size, setSize] = useState({w: props.width, h: props.height});
    const [pos, setPos] = useState({x: props.x, y: props.y});
    const [geometry, setGeometry] = useState<IGeometry | undefined>(undefined);

    const style = {
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        zIndex: props.active ? 2 : 1,
        filter: props.active ? "none" : "grayscale(100%)",
    };

    const handleResize = (size: { w: number, h: number }) => {
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

    const width = size.w;
    const height = size.h - 20;

    return (
        <div className="box" style={style} onMouseDown={handleMouseDown}>
            <BoxHeader onClose={() => props.onClose(props.id)} onMove={handleMove} caption={String(props.type)}/>

            {props.type === BoxType.Note
                && <NoteEditor width={width} height={height} text={props.text}
                               onChange={(e) => props.onChange(props.id, e)}
                               onChangeGeometry={setGeometry}/>}

            {props.type === BoxType.Calc
                && <Calc width={width} height={height} text={props.text}
                         onChange={(e) => props.onChange(props.id, e)}
                         onChangeGeometry={setGeometry}/>}

            {props.type === BoxType.Tetris
                && <Tetris width={width} height={height} text={props.text} active={props.active}
                           onChange={(e) => props.onChange(props.id, e)}
                           onChangeGeometry={setGeometry}/>}

            {props.type === BoxType.Fpe
                && <Fpe width={width} height={height} text={props.text} active={props.active}
                        onChange={(e) => props.onChange(props.id, e)}
                        onChangeGeometry={setGeometry}/>}

            {props.type === BoxType.Asteroids
                && <Asteroids width={width} height={height} text={props.text} active={props.active}
                              onChange={(e) => props.onChange(props.id, e)}
                              onChangeGeometry={setGeometry}/>}

            {props.type === BoxType.Minesweeper
                && <Minesweeper width={width} height={height} text={props.text} active={props.active}
                                onChange={(e) => props.onChange(props.id, e)}
                                onChangeGeometry={setGeometry}/>}

            {props.type === BoxType.Bomberman
                && <Bomberman width={width} height={height} text={props.text} active={props.active}
                              onChange={(e) => props.onChange(props.id, e)}
                              onChangeGeometry={setGeometry}/>}

            {props.type === BoxType.Fpb
                && <Fpb width={width} height={height} text={props.text} active={props.active}
                        onChange={(e) => props.onChange(props.id, e)}
                        onChangeGeometry={setGeometry}/>}

            {props.type === BoxType.Drive
                && <Drive width={width} height={height} text={props.text} active={props.active}
                          onChange={(e) => props.onChange(props.id, e)}
                          onChangeGeometry={setGeometry}/>}

            <BoxResizer width={size.w} height={size.h} onResize={handleResize}
                        geometry={geometry}/>
        </div>
    );
}
