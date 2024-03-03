export interface IRenderOptions {
    showGeometry: boolean;
}

export interface ICarData {
    x: number;
    y: number;
    direction: number;
    speed: number;
    steering: number;
}

export interface IConesData {
    x: number;
    y: number;
}

export interface ISceneData {
    car: ICarData;
    cones: IConesData[];
}
