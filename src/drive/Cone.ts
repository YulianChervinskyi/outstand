import {IConesData} from "./types";

const R = 10;

export class Cone {

    private readonly x: number;
    private readonly y: number;

    constructor(data: IConesData) {
        this.x = data.x;
        this.y = data.y;
    }

    get data(): IConesData {
        return {
            x: this.x,
            y: this.y,
        };
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.fillStyle = "darkorange";
        ctx.arc(this.x, this.y, R, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        for (let i = 2; i > 0; i -= 1) {
            ctx.strokeStyle = "white";
            ctx.lineWidth = R / 10;
            ctx.beginPath();
            ctx.arc(this.x, this.y, i * R / 3, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}