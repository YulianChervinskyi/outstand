import {IControlsStates} from "../Controls";
import {Car, IRenderOptions} from "./Car";

export class Scene {

    private readonly ctx: CanvasRenderingContext2D;
    private readonly car: Car;

    constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')!;
        if (!this.ctx)
            throw new Error("2d context not supported");

        this.car = new Car(canvas.width / 2, canvas.height / 2, -Math.PI / 2, 0);
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
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}