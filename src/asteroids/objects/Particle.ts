import {EObjectType, TColor} from "../types";
import {IMovingObjectParams, MovingObject} from "./MovingObject";

const POINTS = [{x: -1, y: -1}, {x: -1, y: 1}, {x: 1, y: 1}, {x: 1, y: -1}];

export class Particle extends MovingObject {
    constructor(color: TColor, p: IMovingObjectParams = {}) {
        super(EObjectType.particle, {points: POINTS, color}, p);
    }
}