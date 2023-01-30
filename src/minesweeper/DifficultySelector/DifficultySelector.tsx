import {difficulties, EDifficultyType, EOverlayText} from "../config";
import {Face} from "./Faces/Face";
import React from "react";

export interface IDifficultySelectorProps {
    text: EOverlayText | undefined,
    showSelector: (isVisible: boolean) => void,
    setDifficulty: (difficulty: EDifficultyType) => void,
}

export function DifficultySelector(props: IDifficultySelectorProps) {
    return (
        <div className="info-overlay" onClick={() => props.showSelector(false)}>
            {props.text}
            <div className="menu-options">
                {Object.entries(difficulties).map((value) =>
                    <Face background={value[1]}
                          difficulty={value[0] as EDifficultyType}
                          giveDifficulty={(diff) => props.setDifficulty(diff)}
                    />
                )}
            </div>
        </div>
    );
}