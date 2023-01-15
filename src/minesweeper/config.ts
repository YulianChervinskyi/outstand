export enum EDifficultyType {
    Easy = "Easy",
    Medium = "Medium",
    Hard = "Hard",
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