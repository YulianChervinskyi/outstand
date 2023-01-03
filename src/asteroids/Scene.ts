import {Game} from "./Game";
import {IPoint, ISceneObject} from "./types";

export class Scene {
    private readonly ctx = this.canvas.getContext('2d')!;

    constructor(private readonly canvas: HTMLCanvasElement, private readonly game: Game) {
    }

    render() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(cx, cy);

        for (const object of this.game.objects) {
            this.fixObjectPosition(object, cx, cy);
            this.drawObject(object, w, h);
        }

        this.ctx.restore();
    }

    private fixObjectPosition(object: ISceneObject, cx: number, cy: number) {
        object.x < -cx && (object.x = cx);
        object.x > cx && (object.x = -cx);
        object.y < -cy && (object.y = cy);
        object.y > cy && (object.y = -cy);
    }

    private drawObject(object: ISceneObject, w: number, h: number) {
        this.ctx.strokeStyle = object.body.color;

        const points = object.shapeData.points;
        const min = object.shapeData.min;
        const max = object.shapeData.max;

        this.drawShape(points, 0, 0);                                 //  0,  0
        (min.x < 0) && this.drawShape(points, +w, 0);                 //  w,  0
        (min.y < 0) && this.drawShape(points, 0, +h);                 //  0,  h
        (max.x > w) && this.drawShape(points, -w, 0);                 // -w,  0
        (max.y > h) && this.drawShape(points, 0, -h);                 //  0, -h
        (min.x < 0 && min.y < 0) && this.drawShape(points, +w, +h);   //  w,  h
        (min.x < 0 && max.y > h) && this.drawShape(points, +w, -h);   //  w, -h
        (max.x > w && min.y < 0) && this.drawShape(points, -w, +h);   // -w,  h
        (max.x > w && max.y > h) && this.drawShape(points, -w, -h);   // -w, -h
    }

    drawShape(points: IPoint[], sx: number, sy: number) {
        this.ctx.beginPath();
        points.forEach((p, i) => {
            (i === 0 ? this.ctx.moveTo : this.ctx.lineTo).call(this.ctx, p.x + sx, p.y + sy);
        });
        this.ctx.closePath();
        this.ctx.stroke();
    }
}
