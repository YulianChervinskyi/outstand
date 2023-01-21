import {EObjectType, IBody} from "../types";
import {MovingObject} from "./MovingObject";
import {Particle} from "./Particle";

const COLOR = '#fff';
const RADIUS_FACTOR = 5;
const VERTEX_RADIUS_DIFF = 0.15;
const VERTEX_ANGLE_DIFF = 0.5;
const VERTEXES_MIN = 10;
const VERTEXES_MAX = 40;

export class Asteroid extends MovingObject {
    constructor(x: number, y: number, spin: number, speed = 10 + Math.random() * 40,
                vertexes = VERTEXES_MIN + Math.floor(Math.random() * (VERTEXES_MAX - VERTEXES_MIN))
    ) {
        const body: IBody = {color: COLOR, points: []}
        const radius = RADIUS_FACTOR * Math.sqrt(vertexes);
        const angleStep = Math.PI * 2 / vertexes;
        for (let i = 0; i < vertexes; i++) {
            const angle = angleStep * i + angleStep * VERTEX_ANGLE_DIFF * (Math.random() - 0.5);
            const vertexRadius = radius + radius * VERTEX_RADIUS_DIFF * (Math.random() - 0.5);
            body.points.push({
                x: Math.cos(angle) * (0.6 + 0.4 * Math.random()) * vertexRadius,
                y: Math.sin(angle) * (0.6 + 0.4 * Math.random()) * vertexRadius,
            });
        }

        const rotationSpeed = -0.5 + Math.random() * Math.PI / 10;
        super(EObjectType.asteroid, body, {x, y, spin, speed, rotationSpeed});
    }

    split(attackAngle: number) {
        let leftVertexes = this.body.points.length - 1;
        while (leftVertexes >= 5) {
            const vertexes = Math.max(5, Math.floor((0.5 + 0.5 * Math.random()) * leftVertexes / 2));
            const angle = attackAngle - Math.PI / 2 + Math.random() * Math.PI;
            const speed = 1.5 * this.speed + this.speed * Math.random();
            this.generatedObjects.push(new Asteroid(this.x, this.y, angle, speed, vertexes));
            leftVertexes -= vertexes;
        }
    }

    explode() {
        const amountOfParticles = this.body.points.length + Math.floor(Math.random() * 10);
        for (let i = 0; i < amountOfParticles; i++) {
            const params = {
                x: this.x,
                y: this.y,
                spin: Math.random() * Math.PI * 2,
                speed: 100 + 100 * Math.random(),
                ttl: 0.5
            }
            this.generatedObjects.push(new Particle(COLOR, params));
        }
    }

    static deserialize(o: any) {
        const asteroid = new Asteroid(o.x, o.y, o.spin, o.speed, o.body.points.length);
        asteroid.ttl = o.ttl;
        asteroid.body = o.body;
        return asteroid;
    }
}
