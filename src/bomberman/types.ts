export enum ECellType {
    Empty,
    Wall,
    AzovSteel,
    Bomb,
    Fire,
    BonusBomb,
    BonusFire,
    BonusSpeed,
    BonusPush,
}

export type TField = ECellType[][];

export interface ISceneObject {
    pos: IPoint;
    update: (seconds: number) => void;
}

export interface ISize {
    w: number,
    h: number,
}

export interface IPoint {
    x: number,
    y: number,
}