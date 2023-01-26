import React, {useState} from "react";
import {EDifficultyType, difficultiesPng, timer, flag} from "./config";
import './ControlPanel.css';

export interface IControlPanel {
    timer: number,
    flagNumber: number,
    difficulty: EDifficultyType,
    changeDifficulty: (difficulty: EDifficultyType) => void,
}

export function ControlPanel(props: IControlPanel) {
    const [difficulty, setDifficulty] = useState(props.difficulty);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleChangeDifficulty = (value: EDifficultyType) => {
        props.changeDifficulty(value);
        setIsMenuOpen(!isMenuOpen);
        setDifficulty(value);
    }

    return (
        <div className="controlPanel">
            <div className="indicator">
                <img src={timer} alt=""/>
                {props.timer}
            </div>
            <div className="indicator">
                <p onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {difficulty}
                </p>
            </div>
            <div className="indicator">
                <img src={flag} alt=""/>
                {props.flagNumber}
            </div>

            {isMenuOpen && <div className="info-overlay info-overlay-alter">
                Choose difficulty
                <div className="controls">
                    {Object.values(EDifficultyType).map((value) =>
                        <img
                            src={difficultiesPng[value]}
                            onClick={() => handleChangeDifficulty(value)}
                            alt=""
                        />
                    )}
                </div>
            </div>}

        </div>
    );
}
