import {IPoint} from "../types";
import {EXPLOSION_TIME} from "../config";

export class BombModel {
    private listeners: { [key: string]: ((event: BombModel) => void)[] } = {};
    private createExplosion?: (wave: number, pos: IPoint) => void;
    private explosionTime = EXPLOSION_TIME;
    private expWave = 0;

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

    setToExplode(createExplosion: (wave: number, pos: IPoint) => void) {
        this.createExplosion = createExplosion;
    }

    private toExplode() {
        if (!this.createExplosion)
            return;

        const delay = 0.1;

        this.createExplosion(this.expWave, this.pos);

        if (this.expWave === this.power)
            this.listeners["onExplosion"]?.forEach((listener) => listener(this));

        this.explosionTime += delay;
        this.expWave++;
    }
}