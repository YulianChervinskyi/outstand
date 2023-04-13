export enum ECellType {
    Empty,
    Wall,
    AzovSteel,
    Bomb,
    Explosion,
    Bonus,
}

export enum EBonusType {
    Power,
    Supply,
    Speed,
    Push,
    Spam,
    Lottery,
}

export type TField = ECellType[][];

export interface ISceneObject {
    pos: IPoint,

    update(seconds: number): boolean,

    detonate(): void,

    get generatedObject(): ISceneObject | undefined;
}

export interface IPlayerStats {
    pos: IPoint,
    life: number,
    immortality: number,
    speed: number,
    power: number,
    supply: number,
    diarrhoea: number,
    pushAbility: boolean,
}

export interface ISize {
    w: number,
    h: number,
}

export interface IPoint {
    x: number,
    y: number,
}