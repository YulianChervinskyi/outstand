import {EObjectType} from "../types";
import {Bullet} from "./Bullet";
import {MovingObject} from "./MovingObject";
import {Particle} from "./Particle";

const BODY = {
    color: '#0f0',
    points: [{x: 20, y: 0}, {x: -15, y: 10}, {x: -15, y: -10}],
};

const FIRE_TIMEOUT = 0.2;
const MOVING_SPEED = 150;
const TURNING_SPEED = Math.PI;

export class Ship extends MovingObject {

    fireTimeout: number = 0;

    engine = {forward: 0, backward: 0, left: 0, right: 0}

    constructor(x: number = 0, y: number = 0, angle: number = 0) {
        super(EObjectType.ship, BODY, {x, y, angle});
    }

    update(seconds: number) {
        if (this.engine.forward > 0) {
            this.makeJet(-16, 0, this.spin + Math.PI, this.engine.forward);
        }

        if (this.engine.backward > 0) {
            if (this.engine.right > 0)
                this.makeJet(10, -4, this.spin, this.engine.backward);

            if (this.engine.left > 0)
                this.makeJet(10, 4, this.spin, this.engine.backward);

            if (this.engine.right === 0 && this.engine.left === 0) {
                this.makeJet(10, -4, this.spin, this.engine.backward);
                this.makeJet(10, 4, this.spin, this.engine.backward);
            }
        } else {
            if (this.engine.right > 0)
                this.makeJet(10, 4, this.spin - Math.PI / 2, 4);

            if (this.engine.left > 0)
                this.makeJet(10, -4, this.spin + Math.PI / 2, 4);
        }

        this.engine = {forward: 0, backward: 0, left: 0, right: 0};

        return super.update(seconds);
    }

    rotate(value: number) {
        this.angle += value;
    }

    turnRight(seconds: number) {
        this.turn(TURNING_SPEED * seconds);
        this.engine.right = 1;
    }

    turnLeft(seconds: number) {
        this.turn(-TURNING_SPEED * seconds);
        this.engine.left = 1;
    }

    forward(seconds: number) {
        const distance = seconds * MOVING_SPEED;
        this.move(distance);
        this.engine.forward = distance * 6;
    }

    backward(seconds: number) {
        const distance = seconds * MOVING_SPEED / 2;
        this.move(-distance);
        this.engine.backward = distance * 4;
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

    private makeJet(dx: number, dy: number, spin: number, power: number) {
        let sx = this.x + Math.cos(this.angle) * dx + Math.sin(this.angle) * dy;
        let sy = this.y + Math.sin(this.angle) * dx - Math.cos(this.angle) * dy;
        for (let i = 0; i < power; i++) {
            const startOffset = MOVING_SPEED / 10 * Math.random();
            const particleSpin = spin + Math.random() * 0.5 - 0.25;
            const x = sx + Math.cos(particleSpin) * startOffset;
            const y = sy + Math.sin(particleSpin) * startOffset;
            const particle = new Particle("#ff0", {
                x, y,
                spin: particleSpin,
                speed: 2 * MOVING_SPEED + Math.random() * MOVING_SPEED,
                ttl: (0.05 * Math.random() + 0.2) * power / 20,
            });
            this.generatedObjects.push(particle);
        }
    }

    explode() {
        const amountOfParticles = 80 + Math.floor(Math.random() * 70);
        for (let i = 0; i < amountOfParticles; i++) {
            const params = {
                x: this.x,
                y: this.y,
                spin: Math.random() * Math.PI * 2,
                speed: 100 + 100 * Math.random(),
                ttl: 0.5
            }
            this.generatedObjects.push(new Particle(BODY.color, params));
        }
    }

}