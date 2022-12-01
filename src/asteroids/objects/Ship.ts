import {EObjectType} from "../types";
import {Bullet} from "./Bullet";
import {MovingObject} from "./MovingObject";
import {Particle} from "./Particle";

const BODY = {
    color: '#0f0',
    points: [{x: 17, y: 0}, {x: -13, y: 10}, {x: -13, y: -10}],
};

const FIRE_TIMEOUT = 0.2;
const MOVING_SPEED = 150;
const TURNING_SPEED = Math.PI;

export class Ship extends MovingObject {

    fireTimeout: number = 0;

    constructor(x: number = 0, y: number = 0, angle: number = 0) {
        super(EObjectType.ship, BODY, {x, y, angle});
    }

    update(seconds: number) {
        return super.update(seconds);
    }

    rotate(value: number) {
        this.angle += value;
    }

    turnRight(seconds: number) {
        this.turn(TURNING_SPEED * seconds);
    }

    turnLeft(seconds: number) {
        this.turn(-TURNING_SPEED * seconds);
    }

    forward(seconds: number) {
        const distance = seconds * MOVING_SPEED;
        this.move(distance);

        const amount = Math.ceil(distance * 6);
        for (let i = 0; i < amount; i++) {
            const distance = 14 + 5 * Math.random();
            const x = this.x - Math.cos(this.angle) * distance;
            const y = this.y - Math.sin(this.angle) * distance;
            const particle = new Particle("#ff0", {
                x, y,
                spin: this.angle + Math.PI + Math.random() * 0.5 - 0.25,
                speed: 2 * MOVING_SPEED + Math.random() * MOVING_SPEED,
                ttl: 0.05 * Math.random() + 0.2,
            });
            this.generatedObjects.push(particle);
        }

    }

    backward(seconds: number) {
        this.move(-seconds * MOVING_SPEED);
    }

    fire(seconds: number) {
        this.fireTimeout -= seconds;

        if (this.fireTimeout > 0)
            return [];

        this.fireTimeout = FIRE_TIMEOUT;
        const x = this.x + Math.cos(this.spin) * 16;
        const y = this.y + Math.sin(this.spin) * 16;
        return [new Bullet(x, y, this.spin)];
    }

    explosion() {
        const amountOfParticles = 80 + Math.floor(Math.random() * 70);
        const particles: MovingObject[] = [];
        for (let i = 0; i < amountOfParticles; i++) {
            const params = {
                x: this.x,
                y: this.y,
                spin: Math.random() * Math.PI * 2,
                speed: 100 + 100 * Math.random(),
                ttl: 0.5
            }
            particles.push(new Particle(BODY.color, params));
        }
        return particles;
    }

}