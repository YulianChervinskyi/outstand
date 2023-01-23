import {EObjectType, TColor} from "../types";
import {IMovingObjectParams, MovingObject} from "./MovingObject";

const POINTS = [{x: -1, y: -1}, {x: -1, y: 1}, {x: 1, y: 1}, {x: 1, y: -1}];

export class Particle extends MovingObject {
    constructor(color: TColor, p: IMovingObjectParams = {}) {
        super(EObjectType.particle, {points: POINTS, color}, p);
    }

    static deserialize(o: any) {
        const particle = new Particle(o.type);
        particle.body = o.body;
        particle.speed = o.speed;
        particle.spin = o.spin;
        particle.rotationSpeed = o.rotationSpeed;
        particle.spinSpeed = o.spinSpeed;
        particle.ttl = o.ttl;
        return particle;
    }

}