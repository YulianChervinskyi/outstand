import React, {useState} from "react";
import './ControlPanel.css';

enum DifficultyType {
    Easy = "Easy",
    Normal = "Normal",
    Hard = "Hard",
}

export function ControlPanel() {
    const [difficulty, setDifficulty] = useState(DifficultyType.Easy);

    const handleChangeDifficulty = (value: DifficultyType) => {
        setDifficulty(value);
    }

    return (
        <div className="controlPanel">
            <select value={difficulty}
                    onChange={(e) => handleChangeDifficulty(e.target.value as DifficultyType)}>
                {Object.values(DifficultyType).map((value) =>
                    <option>{value}</option>
                )}
            </select>
        </div>
    );
}
