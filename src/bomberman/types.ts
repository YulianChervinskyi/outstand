export enum ECellType {
    Empty = 0,
    Wall = 1,
    AzovSteel = 2,
    Bomb = 3,
    BonusBomb = 4,
    BonusFire = 5,
    BonusSpeed = 6,
    BonusPush = 7,
}

export interface ISize {
    w: number,
    h: number,
}

export interface IPoint {
    x: number,
    y: number,
}