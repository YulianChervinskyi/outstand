export enum ECellType {
    Empty,
    Wall,
    AzovSteel,
    Bomb,
    Explosion,
    Bonus,
}

export enum EBonusType {
    BombSupply,
    SpeedUp,
    ExplosionPower,
    PushBombs,
}

export type TField = ECellType[][];

export interface ISceneObject {
    pos: IPoint;
    update: (seconds: number) => boolean;
}

export interface ISize {
    w: number,
    h: number,
}

export interface IPoint {
    x: number,
    y: number,
}