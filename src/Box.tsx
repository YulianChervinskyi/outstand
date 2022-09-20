import './Box.css';
import {BoxHeader} from "./BoxHeader";
import {NoteEditor} from "./NoteEditor";

interface BoxProps {
    x:number,
    y:number,
    width:number | 'auto',
    height:number,
    text:string,
    onClick:(e: React.MouseEvent) => void,
}

export function Box(props: BoxProps) {
    const style = {
        left: props.x,
        top: props.y,
        width: props.width,
        height: props.height,
    }

    return (
        <div className="box" style={style} onClick={props.onClick}>
            <BoxHeader/>
            <NoteEditor/>
        </div>
    );
}
