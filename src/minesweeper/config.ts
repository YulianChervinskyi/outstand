export enum EDifficultyType {
    Easy = "Easy",
    Normal = "Normal",
    Hard = "Hard",
}

export enum ECellValue {
    V0 = 0,
    V1 = 1,
    V2 = 2,
    V3 = 3,
    V4 = 4,
    V5 = 5,
    V6 = 6,
    V7 = 7,
    V8 = 8,
    Bomb = 9,
}

export enum ECellState {
    Open = "Open",
    Closed = "Closed",
    Flagged = "Flagged",
}

export interface ICell {
    value: ECellValue,
    state: ECellState,
}

export const gameProps = {
    [EDifficultyType.Easy]: {height: 8, width: 8, mines: 10},
    [EDifficultyType.Normal]: {height: 16, width: 16, mines: 40},
    [EDifficultyType.Hard]: {height: 16, width: 30, mines: 99},
}