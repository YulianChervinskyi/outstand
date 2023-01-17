import React, {useState} from "react";
import {EDifficultyType} from "./config";
import './ControlPanel.css';

export interface IControlPanel {
    timer: number,
    flagNumber: number,
    changeDifficulty: (difficulty: EDifficultyType) => void,
}

export function ControlPanel(props: IControlPanel) {
    const [difficulty, setDifficulty] = useState(EDifficultyType.Easy);

    const handleChangeDifficulty = (value: EDifficultyType) => {
        setDifficulty(value);
        props.changeDifficulty(value);
    }

    return (
        <div className="controlPanel">
            <div>{props.timer}</div>
            <select value={difficulty}
                    onChange={(e) => handleChangeDifficulty(e.target.value as EDifficultyType)}>
                {Object.values(EDifficultyType).map((value) =>
                    <option>{value}</option>
                )}
            </select>
            <div>{props.flagNumber}</div>
        </div>
    );
}
