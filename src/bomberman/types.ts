export enum ECellType {
    Empty = 0,
    Wall = 1,
    AzovSteel = 2,
    Bomb = 3,
    Fire = 4,
    BonusBomb = 5,
    BonusFire = 6,
    BonusSpeed = 7,
    BonusPush = 8,
}

export interface ISize {
    w: number,
    h: number,
}

export interface IPoint {
    x: number,
    y: number,
}