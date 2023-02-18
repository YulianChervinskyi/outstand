import {IControlsStates} from "../Controls";

const MAX_AXIS_RATE = 5;

export class PlayerModel {
    readonly pos = {x: 0, y: 0};
    readonly speed = 5;
    private xAxisRate = 0;
    private yAxisRate = 0;
    private checkOffset?: (offset: { x: number, y: number }) => { x: number, y: number };

    constructor(private states: IControlsStates) {}

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
        this.pos.x += offset.x;
        this.pos.y += offset.y;

        const xMovement = Math.abs(offset.x) > Math.abs(offset.y) ? 1 : -1
        this.xAxisRate = Math.max(-MAX_AXIS_RATE, Math.min(MAX_AXIS_RATE, this.xAxisRate + xMovement));
        this.yAxisRate = Math.max(-MAX_AXIS_RATE, Math.min(MAX_AXIS_RATE, this.yAxisRate - xMovement));
    }

    get direction() {
        return this.xAxisRate > this.yAxisRate ? "x" : "y";
    }
}