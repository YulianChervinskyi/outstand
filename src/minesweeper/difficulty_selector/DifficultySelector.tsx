import {EOverlayText, EDifficultyType} from "../types";
import {difficulties} from "../config";
import "./DifficultySelector.scss";
import {Head} from "./heads/Head";
import React from "react";

export interface IDifficultySelectorProps {
    text: EOverlayText | undefined,
    showSelector: (isVisible: boolean) => void,
    setDifficulty: (difficulty: EDifficultyType) => void,
    width: number,
    height: number,
}

export function DifficultySelector(props: IDifficultySelectorProps) {

    const aspect = 3.5;

    let width = props.width;
    let height = width / aspect;

    if (height > props.height - 30) {
        height = props.height - 30;
        width = height * aspect;
    }

    return (
        <div className="difficulty-selector info-overlay" onClick={() => props.showSelector(false)}>
            <div className="container">
                {props.text}
                <div className="difficulties-container" style={{width, height}}>
                    {Object.entries(difficulties).map((value, key) =>
                        <Head background={value[1]}
                              difficulty={value[0] as EDifficultyType}
                              giveDifficulty={(diff) => props.setDifficulty(diff)}
                              key={key}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}