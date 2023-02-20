import {IControlsStates} from "../Controls";
import {IPoint} from "../types";

export class PlayerModel {
    readonly pos: IPoint = {x: 0, y: 0};
    readonly speed = 5;
    private fixOffset?: (pos: IPoint, offset: IPoint) => { x: number, y: number };

    constructor(private states: IControlsStates) {}

    setCheckOffset(checkOffset: (pos: IPoint, offset: IPoint) => { x: number, y: number }) {
        this.fixOffset = checkOffset;
    }

    update(seconds: number) {
        if (!this.fixOffset)
            return;

        const x = this.speed * seconds * (Number(this.states.right) - Number(this.states.left));
        const y = this.speed * seconds * (Number(this.states.backward) - Number(this.states.forward));

        if (x || y) {
            const offset = this.fixOffset(this.pos, {x, y});
            const diagCoef = x && y && offset.x === x && offset.y === y ? 1 / Math.sqrt(2) : 1;
            this.walk({x: offset.x * diagCoef, y: offset.y * diagCoef});
        }
    }

    walk(offset: { x: number, y: number }) {
        this.pos.x += offset.x;
        this.pos.y += offset.y;
    }

}