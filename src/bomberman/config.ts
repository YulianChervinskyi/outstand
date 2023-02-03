import {ECellType} from "./types";

export const FIELD_SIZE = {
    w: 20,
    h: 16,
};

export const bckColors = {
    [ECellType.Free]: "A2B7A2FF",
    [ECellType.Wall]: "1F331FFF",
    [ECellType.UWall]: "#1f2e23",
    [ECellType.Bomb]: "#780615",
    [ECellType.BonusBomb]: "#e80e2b",
    [ECellType.BonusFire]: "#b5b207",
    [ECellType.BonusSpeed]: "#9e90fc",
    [ECellType.BonusPush]: "#71bfb3",
}

