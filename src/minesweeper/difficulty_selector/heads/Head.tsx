import "./Head.css";
import {Eye} from "./Eye";
import {EDifficultyType} from "../../config";
import {useState} from "react";

export interface IFaceProps {
    background: string,
    difficulty: EDifficultyType,
    giveDifficulty: (diff: EDifficultyType) => void,
}

export function Head(props: IFaceProps) {
    const [showTeeth, setShowTeeth] = useState(false);

    return (
        <div className="head rounded"
             style={{backgroundColor: props.background}}
             onClick={() => props.giveDifficulty(props.difficulty)}
             onMouseEnter={() => setShowTeeth(true)}
             onMouseLeave={() => setShowTeeth(false)}
        >
            <div className="v-half-head center-elements">
                <Eye/>
                <Eye/>
            </div>
            <div className="v-half-head center-elements">
                <div className="mouth" style={{backgroundColor: showTeeth ? "#7e1212" : "#a80808"}}>
                    {showTeeth && <div className="teeth center-elements">
                        <div id="left-tooth" className="tooth"></div>
                        <div id="right-tooth" className="tooth"></div>
                    </div>}
                </div>
            </div>
        </div>
    );
}