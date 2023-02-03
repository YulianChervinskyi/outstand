export enum ECellType {
    Free = 0,
    Wall = 1,
    UWall = 2,
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