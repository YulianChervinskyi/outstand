export enum EDifficultyType {
    Easy = "Easy",
    Medium = "Medium",
    Hard = "Hard",
}

export enum EOverlayText {
    Pause = "Pause",
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