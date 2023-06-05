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
    type: string,

    pos: IPoint,

    update(seconds: number): boolean,

    detonate(): void,

    store(): any,

    get generatedObject(): ISceneObject | undefined;
}

export interface IPlayerState {
    life: number,
    speed: number,
    power: number,
    maxSupply: number,
    pushAbility: boolean,
}

export interface IFullPlayerState extends IPlayerState {
    pos: IPoint,
    immortality: number,
    currSupply: number,
    diarrhea: number,
}

export interface ISize {
    w: number,
    h: number,
}

export interface IPoint {
    x: number,
    y: number,
}