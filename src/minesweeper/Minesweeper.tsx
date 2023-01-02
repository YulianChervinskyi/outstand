import {Square} from "./Square";
import {ControlPanel} from "./ControlPanel";

export interface MinesweeperProps {
    width: number,
    height: number,
    text: string,
    onChange: (e: { text: string }) => void,
}

export function Minesweeper(props: MinesweeperProps) {

    return (
        <div style={{width:"100%", height:"100%", backgroundColor:"#819462"}}>
            <ControlPanel/>
            <Square/>
        </div>
    );
}