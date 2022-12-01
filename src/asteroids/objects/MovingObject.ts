import {EObjectType, IBody} from "../types";
import {ISceneObjectParams, SceneObject} from "./SceneObject";

export interface IMovingObjectParams extends ISceneObjectParams {
    spin?: number,
    speed?: number,
    rotationSpeed?: number,
    spinSpeed?: number,
    ttl?: number
}

export class MovingObject extends SceneObject {
    speed: number;
    spin: number;
    rotationSpeed: number;
    spinSpeed: number;

    constructor(type: EObjectType, body: IBody, p: IMovingObjectParams = {}) {
        super(type, body, p);
        this.spin = p.spin || 0;
        this.speed = p.speed || 0;
        this.rotationSpeed = p.rotationSpeed || 0;
        this.spinSpeed = p.spinSpeed || 0;
    }

    update(seconds: number) {
        if (this.ttl > 0) {
            this.ttl -= seconds;
            this.angle += this.rotationSpeed * seconds;
            this.spin += this.spinSpeed * seconds;
            this.move(this.speed * seconds);
        }
        return super.update(seconds);
    }

    turn(value: number) {
        this.spin += value;
        this.angle += value;
    }

    move(value: number) {
        this.position(this.x + Math.cos(this.spin) * value, this.y + Math.sin(this.spin) * value);
    }
}
