import {EDifficultyType, EScreenText, flag, timer} from "./config";
import './ControlPanel.css';
import React from "react";

export interface IControlPanel {
    timer: number,
    flagNumber: number,
    difficulty: EDifficultyType,
    changeDifficulty: (text: EScreenText) => void,
}

export function ControlPanel(props: IControlPanel) {
    return (
        <div className="controlPanel">
            <div className="indicator">
                <img src={timer} alt=""/>
                <p>{props.timer}</p>
            </div>
            <div className="indicator">
                <div className="menu-button" onClick={() => props.changeDifficulty(EScreenText.Difficulty)}>
                    {props.difficulty}
                </div>
            </div>
            <div className="indicator">
                <img src={flag} alt=""/>
                <p>{props.flagNumber}</p>
            </div>
        </div>
    );
}