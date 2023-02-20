import {IControlsStates} from "../Controls";

export class PlayerModel {
    readonly pos = {x: 0, y: 0};
    prevAxis: string | undefined;
    readonly speed = 2.5;
    private checkOffset?: (offset: { x: number, y: number }) => { x: number, y: number };

    constructor(private states: IControlsStates) {
    }

    setCheckOffset(checkOffset: (offset: { x: number, y: number }) => { x: number, y: number }) {
        this.checkOffset = checkOffset;
    }

    update(seconds: number) {
        if (!this.checkOffset)
            return;

        const zx = this.speed * seconds * (Number(this.states.right) - Number(this.states.left));
        const zy = this.speed * seconds * (Number(this.states.backward) - Number(this.states.forward));

        if (zx || zy)
            this.walk(this.checkOffset({x: zx, y: zy}));
    }

    walk(offset: { x: number, y: number }) {
        this.prevAxis = (this.pos.x % 1 === 0 || this.pos.y % 1 === 0) && offset.x ? "x" : "y";

        this.pos.x += offset.x;
        this.pos.y += offset.y;
    }
}