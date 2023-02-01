import {EDifficultyType} from "../../types";
import {Eye} from "./Eye";
import "./Head.scss";

export interface IFaceProps {
    background: string,
    difficulty: EDifficultyType,
    giveDifficulty: (diff: EDifficultyType) => void,
}

export function Head(props: IFaceProps) {

    return (
        <div className="container">
            <div className="head rounded"
                 style={{backgroundColor: props.background}}
                 onClick={() => props.giveDifficulty(props.difficulty)}>
                <div className="center-elements">
                    <Eye/>
                    <Eye/>
                </div>
                <div className="center-elements">
                    <div className="mouth">
                        <div className="teeth center-elements">
                            <div/>
                            <div/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}