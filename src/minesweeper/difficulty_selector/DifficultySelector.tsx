import React from "react";
import {difficulties} from "../config";
import {EDifficultyType} from "../types";
import "./DifficultySelector.scss";
import {Head} from "./heads/Head";

export interface IDifficultySelectorProps {
    onClose: () => void,
    onChangeDifficulty: (difficulty: EDifficultyType) => void,
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
        <div className="difficulty-selector info-overlay" onClick={props.onClose}>
            <div className="container">
                Choose difficulty
                <div className="difficulties-container" style={{width, height}}>
                    {Object.entries(difficulties).map((value, key) =>
                        <Head background={value[1]}
                              difficulty={value[0] as EDifficultyType}
                              giveDifficulty={(diff) => props.onChangeDifficulty(diff)}
                              key={key}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}