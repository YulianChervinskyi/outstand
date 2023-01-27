import flag from "./assets/icons/flag.png";
import timer from "./assets/icons/timer.png";
import easy from "./assets/icons/difficulties/easy.png";
import medium from "./assets/icons/difficulties/medium.png";
import hard from "./assets/icons/difficulties/hard.png";
import laugh from "./assets/sounds/hahaha.mp3";
import victory from "./assets/sounds/victorySound.mp3";

export {flag, timer, laugh, victory};

export enum EDifficultyType {
    Easy = "Easy",
    Medium = "Medium",
    Hard = "Hard",
}

export enum EScreenText {
    Victory = "Victory!",
    GameOver = "Game over!",
    Difficulty = "Choose difficulty",
}

export enum ECellState {
    Open = "Open",
    Closed = "Closed",
    Flagged = "Flagged",
}

export interface ICell {
    value: number,
    state: ECellState,
}

export const gameProps = {
    [EDifficultyType.Easy]: {height: 8, width: 8, mines: 10},
    [EDifficultyType.Medium]: {height: 16, width: 16, mines: 40},
    [EDifficultyType.Hard]: {height: 16, width: 30, mines: 99},
}

export const difficultiesPng = {
    [EDifficultyType.Easy]: easy,
    [EDifficultyType.Medium]: medium,
    [EDifficultyType.Hard]: hard,
};