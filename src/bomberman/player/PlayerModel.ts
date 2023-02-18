const MAX_AXIS_RATE = 5;

export class PlayerModel {
    readonly pos = {x: 0, y: 0};
    readonly speed = 5;
    private xAxisRate = 0;
    private yAxisRate = 0;

    constructor() {
    }

    walk(offsetX: number, offsetY: number) {
        this.pos.x += offsetX;
        this.pos.y += offsetY;

        const xMovement = Math.abs(offsetX) > Math.abs(offsetY) ? 1 : -1
        this.xAxisRate = Math.max(-MAX_AXIS_RATE, Math.min(MAX_AXIS_RATE, this.xAxisRate + xMovement));
        this.yAxisRate = Math.max(-MAX_AXIS_RATE, Math.min(MAX_AXIS_RATE, this.yAxisRate - xMovement));
    }

    get direction() {
        return this.xAxisRate > this.yAxisRate ? "x" : "y";
    }
}