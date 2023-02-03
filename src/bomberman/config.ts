import {ECellType} from "./types";

export const FIELD_SIZE = {
    w: 15,
    h: 11,
};

export const CELL_SIZE = 64;

export const bckColors = {
    [ECellType.Empty]: "#b6bab7",
    [ECellType.Wall]: "#04075c",
    [ECellType.AzovSteel]: "#1f2e23",
    [ECellType.Bomb]: "#780615",
    [ECellType.BonusBomb]: "#e80e2b",
    [ECellType.BonusFire]: "#b5b207",
    [ECellType.BonusSpeed]: "#9e90fc",
    [ECellType.BonusPush]: "#71bfb3",
};
