export type TColor = string | CanvasGradient | CanvasPattern

export interface IPoint {
    x: number,
    y: number,
}

export interface IBody {
    color: TColor,
    points: IPoint[],
}

export enum EObjectType {
    ship,
    bullet,
    asteroid,
    particle,
}

export interface IShapeData {
    points: IPoint[],
    max: IPoint,
    min: IPoint,
}

export interface ISceneObject {
    x: number;
    y: number;
    body: IBody;
    shapeData: IShapeData;
}
