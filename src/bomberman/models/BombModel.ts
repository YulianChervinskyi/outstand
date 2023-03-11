import {IPoint} from "../types";
import {BOMB_LIFETIME} from "../config";

export class BombModel {
    private listeners: { [key: string]: ((event: BombModel) => void)[] } = {};
    private lifetime = 0;

    constructor(readonly pos: IPoint, readonly power: number) {
    }

    update(seconds: number) {
        this.lifetime += seconds;

        if (this.lifetime >= BOMB_LIFETIME)
            this.listeners["onExplosion"]?.forEach((listener) => listener(this));
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
}