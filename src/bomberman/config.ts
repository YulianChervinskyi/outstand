import {ECellType} from "./types";
import {img} from "./assets";

export const FIELD_SIZE = {
    w: 15,
    h: 11,
};

export const CELL_SIZE = 64;

export const cellFilling = {
    [ECellType.Empty]: "#252533",
    [ECellType.Wall]: img.wall,
    [ECellType.AzovSteel]: img.azov_steel,
    [ECellType.Bomb]: img.bomb,
    [ECellType.BonusBomb]: "#e80e2b",
    [ECellType.BonusFire]: "#b5b207",
    [ECellType.BonusSpeed]: "#9e90fc",
    [ECellType.BonusPush]: "#71bfb3",
};