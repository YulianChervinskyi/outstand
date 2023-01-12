import React, {useEffect, useState} from "react";
import './ControlPanel.css';

export interface IControlPanel {
    isGameStarted: boolean,
    flagNumber: number | undefined,
    changeDifficulty: (difficulty: DifficultyType) => void,
}

export enum DifficultyType {
    Easy = "Easy",
    Normal = "Normal",
    Hard = "Hard",
}

export function ControlPanel(props: IControlPanel) {
    const [difficulty, setDifficulty] = useState(DifficultyType.Easy);
    const [time, setTime] = useState(0);

    const handleChangeDifficulty = (value: DifficultyType) => {
        setDifficulty(value);
        props.changeDifficulty(value);
    }

    useEffect(() => {
        const intervalId = props.isGameStarted ?
            setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000) : undefined;

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="controlPanel">
            <div>{time}</div>
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
