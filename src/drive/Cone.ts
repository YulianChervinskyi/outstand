import {IConesData} from "./types";
import {IPoint} from "./Geometry";
import {IMovable} from "./Mover";

const R = 10;

export class Cone implements IMovable {

    private _x: number;
    private _y: number;
    private _hit: boolean = false;

    constructor(data: IConesData) {
        this._x = data.x;
        this._y = data.y;
    }

    get data(): IConesData {
        return {
            x: this._x,
            y: this._y,
        };
    }

    get x() {
        return this._x
    };

    get y() {
        return this._y
    };

    get r() {
        return R;
    }

    get p(): IPoint {
        return {x: this._x, y: this._y};
    }

    move(pos: IPoint) {
        this._x = pos.x;
        this._y = pos.y;
    }

    hit(pos: IPoint) {
        return Math.sqrt(Math.pow(this._x - pos.x, 2) + Math.pow(this._y - pos.y, 2)) < R;
    }

    update(seconds: number) {
        // nothing to do
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this._x, this._y);
        ctx.fillStyle = this._hit ? "red" : "darkorange";
        ctx.arc(this._x, this._y, R, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        for (let i = 2; i > 0; i -= 1) {
            ctx.strokeStyle = "white";
            ctx.lineWidth = R / 10;
            ctx.beginPath();
            ctx.arc(this._x, this._y, i * R / 3, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    setHit(hit: boolean) {
        this._hit = hit;
    }
}