import {IPoint} from "../types";
import {BOMB_LIFETIME} from "../config";

export class BombModel {
    private listeners: { [key: string]: ((event: BombModel) => void)[] } = {};
    private createExplosion?: (power: number, pos: IPoint, delay: number) => void;
    private explosionTime = BOMB_LIFETIME;

    constructor(readonly pos: IPoint, private power: number) {
    }

    update(seconds: number) {
        this.explosionTime -= seconds;

        if (this.explosionTime <= 0)
            this.toExplode();
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

    setInitExplosion(initExplosion: (power: number, pos: IPoint, delay: number) => void) {
        this.createExplosion = initExplosion;
    }

    private toExplode() {
        if (!this.createExplosion)
            return;

        const delay = 0.3;
        this.createExplosion(this.power, this.pos, delay);

        this.listeners["onExplosion"]?.forEach((listener) => listener(this));
    }
}