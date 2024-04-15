import {ICarData, IRenderOptions} from "./types";
import {IRectangle} from "./Geometry";

const LENGTH = 160;
const WIDTH = 72;

export class Car {
    private _x: number;
    private _y: number;
    private direction: number;
    private speed: number;
    private steering: number;
    private turning = 0;
    private driveChangeTime = 0;
    private wheelBase = LENGTH * 0.6;
    private turningPoint?: { x: number, y: number };
    private leg = Infinity;
    private hypotenuse: number = Infinity;
    private hypotenuse1: number = Infinity;
    private hypotenuse2: number = Infinity;

    constructor(data: ICarData) {
        this._x = data.x;
        this._y = data.y;
        this.direction = data.direction;
        this.speed = data.speed;
        this.steering = data.steering;
        this.steer(0);
    }

    get data(): ICarData {
        return {
            x: this._x,
            y: this._y,
            direction: this.direction,
            speed: this.speed,
            steering: this.steering,
        };
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    steer(diff: number) {
        const newSteering = this.steering + diff;
        this.steering = Math.min(2 * Math.PI, Math.max(-2 * Math.PI, newSteering));
        this.turning = this.steering / 8;

        this.hypotenuse = this.wheelBase / Math.sin(this.turning);
        this.leg = Math.cos(this.turning) * this.hypotenuse;

        const hypotenuseSign = Math.sign(this.hypotenuse);
        this.hypotenuse1 = hypotenuseSign * Math.sqrt((this.leg - WIDTH * 0.5) ** 2 + this.wheelBase ** 2);
        this.hypotenuse2 = hypotenuseSign * Math.sqrt((this.leg + WIDTH * 0.5) ** 2 + this.wheelBase ** 2);
    }

    drive(diff: number) {
        const now = Date.now();
        const newSpeed = this.speed + diff;
        this.speed = (now - this.driveChangeTime > 50 || Math.sign(newSpeed) === Math.sign(this.speed))
            ? newSpeed : 0;

        this.driveChangeTime = now;
    }

    update(seconds: number) {
        this.move(this.speed * seconds);
    }

    render(ctx: CanvasRenderingContext2D, options?: IRenderOptions) {
        const wheelOffsetX = WIDTH * 0.5;
        const wheelOffsetY = this.wheelBase * 0.5;
        const turningSign = Math.sign(this.turning);
        const angle1 = turningSign * Math.acos((this.leg - wheelOffsetX) / this.hypotenuse1) || 0;
        const angle2 = turningSign * Math.acos((this.leg + wheelOffsetX) / this.hypotenuse2) || 0;

        this.renderWheel(ctx, -wheelOffsetX, +wheelOffsetY, 0);
        this.renderWheel(ctx, wheelOffsetX, +wheelOffsetY, 0);
        this.renderWheel(ctx, -wheelOffsetX, -wheelOffsetY, angle1);
        this.renderWheel(ctx, +wheelOffsetX, -wheelOffsetY, angle2);

        this.renderBody(ctx);

        this.renderSteering(ctx);
        this.renderSpeed(ctx);

        this.drawRectangle(ctx, this.getRectangle());

        options?.showGeometry && this.renderTurningGeometry(ctx);
    }

    private move(distance: number) {
        if (this.turning === 0) {
            this._x += Math.cos(this.direction) * distance;
            this._y += Math.sin(this.direction) * distance;
            delete this.turningPoint;
        } else {
            this.turningPoint = {
                x: this._x - Math.sin(this.direction) * this.leg - Math.cos(this.direction) * LENGTH * 0.3,
                y: this._y + Math.cos(this.direction) * this.leg - Math.sin(this.direction) * LENGTH * 0.3,

            };
            this.direction += distance / this.hypotenuse;
            this._x = this.turningPoint.x + Math.sin(this.direction) * this.leg + Math.cos(this.direction) * LENGTH * 0.3;
            this._y = this.turningPoint.y - Math.cos(this.direction) * this.leg + Math.sin(this.direction) * LENGTH * 0.3;
        }
    }

    private renderBody(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this._x, this._y);
        ctx.rotate(this.direction);
        ctx.fillStyle = 'red';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(-LENGTH / 2, -WIDTH / 2, LENGTH, WIDTH);
        ctx.restore();
    }

    private renderWheel(ctx: CanvasRenderingContext2D, x: number, y: number, direction: number) {
        ctx.save();

        const cos = Math.cos(this.direction - Math.PI / 2);
        const sin = Math.sin(this.direction - Math.PI / 2);
        ctx.translate(this._x + x * cos + y * sin, this._y + x * sin - y * cos);
        ctx.rotate(this.direction + direction);
        ctx.fillStyle = 'black';
        const width = WIDTH / 6;
        const length = LENGTH / 4;
        ctx.fillRect(-length / 2, -width / 2, length, width);
        ctx.restore();
    }

    private renderSteering(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(47, 70);
        ctx.rotate(this.steering - Math.PI / 2);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;

        let angleArc = Math.PI * 0.85;
        ctx.beginPath();
        ctx.arc(0, 0, 40, -angleArc, angleArc);
        ctx.lineTo(Math.cos(-angleArc) * 40, Math.sin(-angleArc) * 40);
        ctx.stroke();

        let angleInnerUp = Math.PI * 0.45;
        let angleCenterUp = Math.PI * 0.35;
        ctx.beginPath();
        ctx.moveTo(Math.cos(-angleCenterUp) * 15, Math.sin(-angleCenterUp) * 15);
        ctx.arc(0, 0, 37, -angleInnerUp, angleInnerUp);
        ctx.lineTo(Math.cos(angleCenterUp) * 15, Math.sin(angleCenterUp) * 15);
        ctx.stroke();

        let angleInnerDown = Math.PI * 0.55;
        let angleCenterDown = Math.PI * 0.65;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angleCenterDown) * 15, Math.sin(angleCenterDown) * 15);
        ctx.arc(0, 0, 37, angleInnerDown, angleArc);
        ctx.lineTo(Math.cos(-angleArc) * 37, Math.sin(-angleArc) * 37);
        ctx.arc(0, 0, 37, -angleArc, -angleInnerDown);
        ctx.lineTo(Math.cos(-angleCenterDown) * 15, Math.sin(-angleCenterDown) * 15);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }

    private renderSpeed(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = '16px monospace';
        ctx.fillText(`speed: ${(this.speed * 0.1).toFixed(2)}  turning: ${(this.turning * 180 / Math.PI).toFixed(2)}`, 4, 20);
        ctx.restore();
    }

    private renderTurningGeometry(ctx: CanvasRenderingContext2D) {
        const x = LENGTH * 0.3;
        const y = 0;

        if (!this.turningPoint)
            return;

        ctx.save();
        ctx.translate(this._x, this._y);
        ctx.rotate(this.direction);
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(x, y);
        // const frontAngle = this.turning + Math.PI / 2;
        // ctx.lineTo(x + Math.cos(frontAngle) * this.hypotenuse, y + Math.sin(frontAngle) * this.hypotenuse);
        ctx.rotate(-this.direction);
        ctx.translate(-this._x, -this._y);
        ctx.lineTo(this.turningPoint.x, this.turningPoint.y);
        ctx.translate(this._x, this._y);
        ctx.rotate(this.direction);

        ctx.moveTo(-x, y);
        // const backAngle = Math.PI / 2;
        // ctx.lineTo(-x + Math.cos(backAngle) * this.leg, y + Math.sin(backAngle) * this.leg);
        ctx.rotate(-this.direction);
        ctx.translate(-this._x, -this._y);
        ctx.lineTo(this.turningPoint.x, this.turningPoint.y);
        ctx.translate(this._x, this._y);
        ctx.rotate(this.direction);
        ctx.stroke();

        // center
        ctx.strokeStyle = 'cyan';

        ctx.beginPath();
        ctx.arc(-x, y + this.leg, Math.abs(this.hypotenuse), 0, 2 * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(-x, y + this.leg, Math.abs(this.leg), 0, 2 * Math.PI);
        ctx.stroke();

        // front wheels
        ctx.strokeStyle = 'green';

        ctx.beginPath();
        ctx.arc(-x, y + this.leg, Math.abs(this.hypotenuse1), 0, 2 * Math.PI);
        ctx.moveTo(-x, y + this.leg);
        ctx.lineTo(x, y - WIDTH * 0.5);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(-x, y + this.leg, Math.abs(this.hypotenuse2), 0, 2 * Math.PI);
        ctx.moveTo(-x, y + this.leg);
        ctx.lineTo(x, y + WIDTH * 0.5);
        ctx.stroke();

        // back wheels
        ctx.strokeStyle = 'orange';

        ctx.beginPath();
        ctx.arc(-x, y + this.leg, Math.abs(this.leg) - WIDTH * 0.5, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(-x, y + this.leg, Math.abs(this.leg) + WIDTH * 0.5, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.restore();
    }

    getRectangle(): IRectangle {
        const cos = Math.cos(this.direction);
        const sin = Math.sin(this.direction);
        const x = this._x;
        const y = this._y;
        const hw = WIDTH / 2;
        const hl = LENGTH / 2;

        const a = {x: x + hl * cos - hw * sin, y: y + hl * sin + hw * cos};
        const b = {x: x - hl * cos - hw * sin, y: y - hl * sin + hw * cos};
        const c = {x: x - hl * cos + hw * sin, y: y - hl * sin - hw * cos};
        const d = {x: x + hl * cos + hw * sin, y: y + hl * sin - hw * cos};
        return {a, b, c, d};
    }

    drawRectangle(ctx: CanvasRenderingContext2D, rectangle: IRectangle) {
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.moveTo(rectangle.a.x, rectangle.a.y);
        ctx.lineTo(rectangle.b.x, rectangle.b.y);
        ctx.lineTo(rectangle.c.x, rectangle.c.y);
        ctx.lineTo(rectangle.d.x, rectangle.d.y);
        ctx.lineTo(rectangle.a.x, rectangle.a.y);
        ctx.stroke();
    }

    setHit(collision: boolean) {
        // show collision effect
    }
}