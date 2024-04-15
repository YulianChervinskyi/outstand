import {IPoint} from "./Geometry";

export interface IMovable extends IPoint {
    move: (pos: IPoint) => void;
    hit: (pos: IPoint) => boolean;
}

export class Mover {
    private objects: IMovable[] = [];
    private target?: { movable: IMovable, start: IPoint, oldPos: IPoint }
    private bounders: DOMRect;
    private scale: IPoint;

    constructor(private readonly canvas: HTMLCanvasElement) {
        canvas.addEventListener('mousedown', this.handleMouseDown);
        this.resize();
        this.bounders = canvas.getBoundingClientRect();
        this.scale = {x: canvas.width / this.bounders.width, y: canvas.height / this.bounders.height};
    }

    resize() {
        this.bounders = this.canvas.getBoundingClientRect();
        this.scale = {x: this.canvas.width / this.bounders.width, y: this.canvas.height / this.bounders.height};
    }

    add(obj: IMovable) {
        this.objects.push(obj);
    }

    remove(obj: IMovable) {
        this.objects = this.objects.filter(o => o !== obj);
    }

    private handleMouseDown = (e: MouseEvent) => {
        this.resize();
        for (let movable of this.objects) {
            const x = (e.clientX - this.bounders.x) * this.scale.x;
            const y = (e.clientY - this.bounders.y) * this.scale.y;
            if (!movable.hit({x, y}))
                continue;

            this.target = {movable, start: {x: e.clientX, y: e.clientY}, oldPos: {x: movable.x, y: movable.y}};
        }

        if (this.target) {
            document.body.addEventListener('mousemove', this.handleMouseMove);
            document.body.addEventListener('mouseup', this.handleMouseUp);
        }
    }

    private handleMouseUp = () => {
        this.target = undefined;
        document.body.removeEventListener('mousemove', this.handleMouseMove);
        document.body.removeEventListener('mouseup', this.handleMouseUp);
    }

    private handleMouseMove = (e: MouseEvent) => {
        if (!this.target)
            return;

        console.log(e.clientX - this.target.start.x, e.clientY - this.target.start.y);
        this.target.movable.move({
            x: this.target.oldPos.x + (e.clientX - this.target.start.x) * this.scale.x,
            y: this.target.oldPos.y + (e.clientY - this.target.start.y) * this.scale.y,
        });
    }
}