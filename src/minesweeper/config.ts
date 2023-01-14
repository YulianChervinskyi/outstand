export enum DifficultyType {
    Easy = "Easy",
    Normal = "Normal",
    Hard = "Hard",
}

export enum cellValue {
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

export enum cellState {
    Open = "Open",
    Closed = "Closed",
    Flagged = "Flagged",
}

export interface cell {
    value: cellValue,
    state: cellState,
}

export const gameProps = {
    [DifficultyType.Easy]: {height: 8, width: 8, mines: 10},
    [DifficultyType.Normal]: {height: 16, width: 16, mines: 40},
    [DifficultyType.Hard]: {height: 16, width: 30, mines: 99},
}