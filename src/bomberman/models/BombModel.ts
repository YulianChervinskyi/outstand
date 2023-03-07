import {IPoint} from "../types";
import {EXPLOSION_TIME} from "../config";

export class BombModel {
    private listeners: { [key: string]: ((event: BombModel) => void)[] } = {};

    constructor(readonly spawnTime: number, readonly spawnPos: IPoint) {
    }

    update() {
        const currTime = performance.now() / 1000;

        if (this.spawnTime < currTime - EXPLOSION_TIME)
            this.explosion();
    }

    addEventListener(event: "onExplosion", callback: (event: BombModel) => void) {
        this.listeners[event] = this.listeners[event] || [];
        if (this.listeners[event].includes(callback))
            return;

        this.listeners[event].push(callback);
    }

    removeEventListener(event: "onExplosion", callback: (event: BombModel) => void) {
        if (!this.listeners[event])
            return;

        this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback);
    }

    private explosion() {
        // TODO add explosion logic
        this.listeners["onExplosion"]?.forEach((listener) => listener(this));
    }

}