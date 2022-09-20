import './Box.css';
import {BoxHeader} from "./BoxHeader";
import {BoxResizer} from "./BoxResizer";
import {NoteEditor} from "./NoteEditor";

interface BoxProps {
    x:number,
    y:number,
    width:number | 'auto',
    height:number,
    text:string,
    onChange:(e: {text: string}) => void,
    onMove:(pos: {x: number, y:number}) => void,
    onClose:() => void,
    onResize:(size: {width: number, height:number}) => void,
}

export function Box(props: BoxProps) {
    const style = {
        left: props.x,
        top: props.y,
        width: props.width,
        height: props.height,
    }

    return (
        <div className="box" style={style}>
            <BoxHeader onClose={props.onClose} onMove={props.onMove}/>
            <NoteEditor onChange={props.onChange}/>
            <BoxResizer onResize={props.onResize}/>
        </div>
    );
}
