import React, {useState} from "react";
import {DifficultyType} from "./config";
import './ControlPanel.css';

export interface IControlPanel {
    timer: number,
    flagNumber: number,
    changeDifficulty: (difficulty: DifficultyType) => void,
}

export function ControlPanel(props: IControlPanel) {
    const [difficulty, setDifficulty] = useState(DifficultyType.Normal);

    const handleChangeDifficulty = (value: DifficultyType) => {
        setDifficulty(value);
        props.changeDifficulty(value);
    }

    return (
        <div className="controlPanel">
            <div>{props.timer}</div>
            <select value={difficulty}
                    onChange={(e) => handleChangeDifficulty(e.target.value as DifficultyType)}>
                {Object.values(DifficultyType).map((value) =>
                    <option>{value}</option>
                )}
            </select>
            <div>{props.flagNumber}</div>
        </div>
    );
}
