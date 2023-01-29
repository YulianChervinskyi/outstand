import "./Face.css";
import {Eye} from "./Eye";
import {EDifficultyType} from "../config";

export interface IFaceProps {
    background: string,
    difficulty: EDifficultyType,
    giveDifficulty: (diff: EDifficultyType) => void,
}

export function Face(props: IFaceProps) {
    return (
        <div className="face-shape rounded"
             style={{backgroundColor: props.background}}
             onClick={() => props.giveDifficulty(props.difficulty)}>
            <div className="half-face center-elements">
                <Eye/>
                <Eye/>
            </div>
            <div className="half-face center-elements">
                <div className="mouth"/>
            </div>
        </div>
    );
}