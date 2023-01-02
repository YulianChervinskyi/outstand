import React, {useEffect, useRef, useState} from "react";
import './ControlPanel.css';

enum DifficultyType {
    Easy = "Easy",
    Normal = "Normal",
    Hard = "Hard",
}

export function ControlPanel() {
    const [currentDifficulty, setCurrentDifficulty] = useState(DifficultyType.Easy);
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const ref = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
            console.log("click outside after check");
            setIsMenuVisible(false);
        }
    };

    const handleSelectDifficulty = (value: DifficultyType) => {
        setCurrentDifficulty(value);
        setIsMenuVisible(!isMenuVisible);
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    return (
        <div className="controlPanel">
            <div className="menu" ref={ref}>
                <button onClick={() => setIsMenuVisible(!isMenuVisible)}>{currentDifficulty}</button>
                <div style={{display: isMenuVisible ? "block" : "none"}} >
                    {Object.values(DifficultyType).map((value) =>
                        <button onClick={() => handleSelectDifficulty(value)}>
                            {value}
                        </button>)}
                </div>
            </div>
        </div>
    );
}
