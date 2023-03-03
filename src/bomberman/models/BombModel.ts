import {IPoint} from "../types";

export class BombModel {
    readonly spawnTime = performance.now() / 1000;
    readonly spawnPos: IPoint = {x: 0, y: 0};

    private listeners: { [key: string]: ((event: BombModel) => void)[] } = {};

    constructor(pos: { x: number, y: number }) {
        this.spawnPos = {x: pos.x, y: pos.y};
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