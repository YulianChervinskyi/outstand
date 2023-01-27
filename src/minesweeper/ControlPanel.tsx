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
        setDifficulty(value);
    }

    const handleOptionClick = (value: EDifficultyType) => {
        handleChangeDifficulty(value);
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <div className="controlPanel">
            <div className="indicator">
                <img src={timer} alt=""/>
                <p>{props.timer}</p>
            </div>
            <div className="indicator">
                <div className="menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {difficulty}
                </div>
            </div>
            <div className="indicator">
                <img src={flag} alt=""/>
                <p>{props.flagNumber}</p>
            </div>

            {isMenuOpen && <div className="info-overlay menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    Choose difficulty
                    <div className="menu-options">
                        {Object.values(EDifficultyType).map((value) =>
                            <img
                                src={difficultiesPng[value]}
                                onClick={() => handleOptionClick(value)}
                                id="option"
                                alt=""
                            />
                        )}
                    </div>
                </div>}
        </div>
    );
}
