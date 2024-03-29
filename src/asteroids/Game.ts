import {Controls} from "./Controls";
import {Asteroid} from "./objects/Asteroid";
import {Bullet} from "./objects/Bullet";
import {Particle} from "./objects/Particle";
import {SceneObject} from "./objects/SceneObject";
import {Ship} from "./objects/Ship";
import {EObjectType} from "./types";

export class Game {

    player = new Ship();
    objects: SceneObject[] = [this.player];
    controls = new Controls();
    paused = false;
    lives = 4;
    score = 0;
    level = 1;

    constructor(private readonly onGameOver: () => void) {
    }

    pause(value: boolean) {
        this.paused = value;
    }

    reset() {
        this.objects = [this.player];
        this.lives = 4;
        this.score = 0;
        this.paused = false;
    }

    update(seconds: number, active?: boolean) {
        const objectsToAdd: SceneObject[] = [];
        const idsToDelete: number[] = [];

        if (this.paused)
            return;

        if (active && this.lives > 0) {
            this.controls.states.forward && this.player.forward(seconds);
            this.controls.states.backward && this.player.backward(seconds);
            this.controls.states.right && this.player.turnRight(seconds);
            this.controls.states.left && this.player.turnLeft(seconds);
            this.controls.states.fire && this.objects.push(...this.player.fire(seconds));
        }

        for (let i = 0; i < this.objects.length; i++) {
            const o1 = this.objects[i];
            if (![EObjectType.asteroid, EObjectType.bullet, EObjectType.ship].includes(o1.type))
                continue;

            for (let j = i + 1; j < this.objects.length; j++) {
                const o2 = this.objects[j];
                if (![EObjectType.asteroid, EObjectType.bullet, EObjectType.ship].includes(o2.type))
                    continue;

                if (o1.checkCollision(o2)) {
                    const types = [o1.type, o2.type];
                    if (types.includes(EObjectType.asteroid)) {
                        if (types.includes(EObjectType.bullet)) {
                            const [a, b] = (o1.type === EObjectType.asteroid ? [o1, o2] : [o2, o1]) as [Asteroid, Bullet];
                            a.split(b.angle);
                            idsToDelete.push(i, j);
                            this.score += 10;
                        } else if (types.includes(EObjectType.ship)) {
                            const [a, s] = (o1.type === EObjectType.asteroid ? [o1, o2] : [o2, o1]) as [Asteroid, Ship];
                            a.explode();
                            s.explode();
                            objectsToAdd.push(...this.destroyPlayer());
                            idsToDelete.push(i, j);
                        }
                    }
                }
            }
        }

        for (let i = 0; i < this.objects.length; i++) {
            const object = this.objects[i];
            objectsToAdd.push(...object.update(seconds));
            if (object.ttl && object.ttl <= 0) {
                idsToDelete.push(i);
                if (object.type === EObjectType.bullet) {
                    this.score = Math.max(0, this.score - 1);
                }
            }
        }

        for (let i = idsToDelete.length - 1; i >= 0; i--) {
            this.objects.splice(idsToDelete[i], 1);
        }

        if (this.lives > 0)
            this.spawnAsteroids(seconds);

        this.objects.push(...objectsToAdd);
    }

    serialize() {
        return JSON.stringify(this);
    }

    deserialize(text: string) {
        const data = JSON.parse(text);
        this.objects = data.objects.map((o: any) => {
            switch (o.type) {
                case EObjectType.asteroid:
                    return Asteroid.deserialize(o);
                case EObjectType.bullet:
                    return Bullet.deserialize(o);
                case EObjectType.ship:
                    return Ship.deserialize(o);
                case EObjectType.particle:
                    return Particle.deserialize(o);
            }
        });
        this.player = this.objects.find(o => o.type === EObjectType.ship) as Ship;
        this.lives = data.lives;
        this.score = data.score;
        this.level = data.level;
        this.paused = data.paused;
    }

    private spawnAsteroids(seconds: number) {
        const spawnRate = 0.1;
        const spawnChance = spawnRate * seconds;
        if (Math.random() < spawnChance) {
            const angle = Math.random() * Math.PI * 2;
            const x = 300 * Math.cos(angle);
            const y = 300 * Math.sin(angle);
            this.objects.push(new Asteroid(x, y, angle + Math.PI));
        }

    }

    private destroyPlayer() {
        this.lives--;
        this.player = new Ship();

        if (this.lives === 0)
            this.onGameOver();

        return this.lives > 0 ? [this.player] : [];
    }
}
