import {EObjectType} from "../types";
import {MovingObject} from "./MovingObject";

const BODY = {
    color: '#f00',
    points: [{x: -2, y: -2}, {x: 3, y: 0}, {x: -2, y: 2}],
};

export class Bullet extends MovingObject {
    constructor(x: number = 0, y: number = 0, angle: number = 0, speed: number = 300, ttl: number = 1) {
        super(EObjectType.bullet, BODY, {x, y, angle, spin: angle, speed, ttl});
    }
}