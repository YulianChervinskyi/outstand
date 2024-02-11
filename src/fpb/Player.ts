import {IControlsStates} from "./Controls";
import {Map} from "./Map";
import {CIRCLE} from "../fpe/common";

export class Player {

    constructor(public x: number, public y: number, public direction: number) {
    }

    rotate(angle: number) {
        this.direction = (this.direction + angle + CIRCLE) % (CIRCLE);
    }

    walk(distance: number, map: Map) {
        const dx = Math.cos(this.direction) * distance;
        const dy = Math.sin(this.direction) * distance;
        if (map.get(this.x + dx, this.y) === 255) this.x += dx;
        if (map.get(this.x, this.y + dy) === 255) this.y += dy;
    }

    shift(distance: number, map: Map) {
        const dx = Math.cos(this.direction - Math.PI / 2) * distance;
        const dy = Math.sin(this.direction - Math.PI / 2) * distance;
        if (map.get(this.x + dx, this.y) === 255) this.x += dx;
        if (map.get(this.x, this.y + dy) === 255) this.y += dy;
    }

    update(states: IControlsStates, map: Map, seconds: number) {
        if (states.left) this.shift(3 * seconds, map);
        if (states.right) this.shift(-3 * seconds, map);
        if (states.forward) this.walk(3 * seconds, map);
        if (states.backward) this.walk(-3 * seconds, map);
        if (states.movementX) this.rotate(0.1 * states.movementX * seconds);
        states.movementX = 0;
    }
}