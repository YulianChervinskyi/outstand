import weapon from "./assets/knife_hand.png";
import {Bitmap, CIRCLE} from "./common";
import {IControlsStates} from "./Controls";
import {Map} from "./Map";

export class Player {
    public weapon: Bitmap;
    public paces = 0;

    constructor(public x: number, public y: number, public direction: number) {
        this.weapon = new Bitmap(weapon, 319, 320);
    }

    rotate(angle: number) {
        this.direction = (this.direction + angle + CIRCLE) % (CIRCLE);
    }

    walk(distance: number, map: Map) {
        var dx = Math.cos(this.direction) * distance;
        var dy = Math.sin(this.direction) * distance;
        if (map.get(this.x + dx, this.y) <= 0) this.x += dx;
        if (map.get(this.x, this.y + dy) <= 0) this.y += dy;
        this.paces += distance;
    }

    update(controls: IControlsStates, map: Map, seconds: number) {
        if (controls.left) this.rotate(-Math.PI * seconds);
        if (controls.right) this.rotate(Math.PI * seconds);
        if (controls.forward) this.walk(3 * seconds, map);
        if (controls.backward) this.walk(-3 * seconds, map);
    }
}
