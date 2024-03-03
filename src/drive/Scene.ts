import {IControlsStates} from "../Controls";
import {Car} from "./Car";
import {Cone} from "./Cone";
import {IRenderOptions, ISceneData} from "./types";

export class Scene {

    private readonly ctx: CanvasRenderingContext2D;
    private readonly car: Car;
    private readonly cons: Cone[] = [];

    constructor(canvas: HTMLCanvasElement, data?: ISceneData) {
        this.ctx = canvas.getContext('2d')!;
        if (!this.ctx)
            throw new Error("2d context not supported");

        if (!data) {
            data = {
                car: {x: canvas.width / 2, y: canvas.height / 2, direction: -Math.PI / 2, speed: 0, steering: 0},
                cones: [
                    {x: 100, y: 100},
                    {x: 100, y: 200},
                    {x: 100, y: 300},
                    {x: 100, y: 400},
                    {x: 100, y: 500},
                    {x: 100, y: 600},
                ]
            }
        }

        this.car = new Car(data.car);
        this.cons = data.cones.map(c => new Cone(c));
    }

    get data() {
        return {
            car: this.car.data,
            cones: this.cons.map(c => c.data)
        };
    }

    update(states: IControlsStates, seconds: number, renderOptions?: IRenderOptions) {
        if (states.left) {
            this.car.steer(-5 * seconds);
        }
        if (states.right) {
            this.car.steer(5 * seconds);
        }
        if (states.forward) {
            this.car.drive(100 * seconds);
        }
        if (states.backward) {
            this.car.drive(-100 * seconds);
        }

        if (states.movementX) {
            this.car.steer(0.5 * states.movementX * seconds);
        }

        this.car.update(seconds);
        this.render(renderOptions);
    }

    render(options?: IRenderOptions) {
        this.clear();
        this.car.render(this.ctx, options);
        this.cons.forEach(c => c.render(this.ctx));
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}