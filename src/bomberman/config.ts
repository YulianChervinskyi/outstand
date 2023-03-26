import {ECellType} from "./types";
import {img} from "./assets";

export const CELL_SIZE = 64;
export const FIELD_FILLING = 0.5;

export const BOMB_LIFETIME = 3;
export const BONUS_LIFETIME = 20;
export const EXPLOSION_LIFETIME = 1;

export const EXPLOSION_SPAWN_DELAY = 0.1;
export const BONUS_GENERATION_CHANCE = 0.825;

export const FIELD_SIZE = {
    w: 15,
    h: 11,
};

export const cellImg = {
    [ECellType.Empty]: "",
    [ECellType.Wall]: img.wall,
    [ECellType.AzovSteel]: img.azov_steel,
    [ECellType.Bomb]: img.bomb,
    [ECellType.Explosion]: "#0729d3",
    [ECellType.Bonus]: "#e80e2b",
};