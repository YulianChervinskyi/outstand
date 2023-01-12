import React, {useState} from "react";
import './ControlPanel.css';

export interface IControlPanel {
    time: number,
    flagNumber: number,
    changeDifficulty: (difficulty: DifficultyType) => void,
}

export enum DifficultyType {
    Easy = "Easy",
    Normal = "Normal",
    Hard = "Hard",
}

export function ControlPanel(props: IControlPanel) {
    const [difficulty, setDifficulty] = useState(DifficultyType.Easy);

    const handleChangeDifficulty = (value: DifficultyType) => {
        setDifficulty(value);
        props.changeDifficulty(value);
    }

    return (
        <div className="controlPanel">
            <div>{props.time}</div>
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
