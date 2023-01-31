import flag from "./assets/icons/flag.png";
import timer from "./assets/icons/timer.png";
import laugh from "./assets/sounds/hahaha.mp3";
import victory from "./assets/sounds/victorySound.mp3";
import cellFlag from "./game_field/cell_icons/flag.png";
import cellMine from "./game_field/cell_icons/mine.png";

export {flag, timer, laugh, victory, cellMine, cellFlag};

export enum EDifficultyType {
    Easy = "Easy",
    Medium = "Medium",
    Hard = "Hard",
}

export enum EOverlayText {
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

export const difficulties = {
    [EDifficultyType.Easy]: "#edd0bbff",
    [EDifficultyType.Medium]: "#ad620cff",
    [EDifficultyType.Hard]: "#4d2408ff",
};