import {IPoint} from "../types";

export class BombModel {
    readonly spawnTime = performance.now() / 1000;
    readonly spawnPos: IPoint = {x: 0, y: 0};

    constructor(pos: { x: number, y: number }) {
        this.spawnPos = {x: pos.x, y: pos.y};
    }
}