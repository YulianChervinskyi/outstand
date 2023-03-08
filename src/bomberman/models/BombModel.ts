import {IPoint} from "../types";
import {EXPLOSION_TIME} from "../config";

export class BombModel {
    private listeners: { [key: string]: ((event: BombModel) => void)[] } = {};
    private explosionTime = EXPLOSION_TIME;

    constructor(readonly spawnPos: IPoint) {
    }

    update(seconds: number) {
        this.explosionTime -= seconds;

        if (this.explosionTime <= 0)
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