import {IPoint, ISceneObject} from "../types";
import {BOMB_LIFETIME} from "../config";

export class BombModel implements ISceneObject {
    private listeners: { [key: string]: ((event: BombModel) => void)[] } = {};

    private lifetime = 0;

    constructor(readonly pos: IPoint, readonly power: number) {
    }

    update(seconds: number) {
        this.lifetime += seconds;
        if (this.lifetime < BOMB_LIFETIME)
            return true;

        this.listeners["onExplosion"]?.forEach((listener) => listener(this));
        return false;
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