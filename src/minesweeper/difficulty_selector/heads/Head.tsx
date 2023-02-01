import {EDifficultyType} from "../../types";
import {Eye} from "./Eye";
import "./Head.css";

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
                <div className="v-half-head center-elements">
                    <Eye/>
                    <Eye/>
                </div>
                <div className="v-half-head center-elements">
                    <div className="mouth">
                        <div className="teeth center-elements">
                            <div id="left-tooth" className="tooth"></div>
                            <div id="right-tooth" className="tooth"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}