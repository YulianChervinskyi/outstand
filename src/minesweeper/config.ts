import {EDifficultyType} from "./types";

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