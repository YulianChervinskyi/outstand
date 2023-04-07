import {EBonusType} from "./types";

export const CELL_SIZE = 64;
export const FIELD_FILLING = 0.75;

export const BOMB_LIFETIME = 3;
export const BONUS_LIFETIME = 20;
export const EXPLOSION_LIFETIME = 1;

export const EXPLOSION_SPAWN_DELAY = 0.1;
export const BOMB_SPAMMING_TIME = 10;

export const FIELD_SIZE = {
    w: 15,
    h: 11,
};

export const BONUS_FILLING: { [type: number]: number } = {
    [EBonusType.Power]: 5,
    [EBonusType.Supply]: 4,
    [EBonusType.Speed]: 3,
    [EBonusType.Push]: 2,
    [EBonusType.Spam]: 8,
    [EBonusType.Lottery]: 5,
}