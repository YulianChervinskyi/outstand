import {IControlsStates} from "../Controls";
import {Car} from "./Car";
import {Cone} from "./Cone";
import {IRenderOptions, ISceneData} from "./types";
import {circleIntersectRectangle} from "./Geometry";
import alarm from "./assets/sounds/alarm.mp3";
import {Mover} from "./Mover";

export class Scene {

    private readonly ctx: CanvasRenderingContext2D;
    private readonly car: Car;
    private readonly cons: Cone[] = [];
    private readonly collisionSound = new Audio(alarm);
    private readonly mover = new Mover(this.canvas);

    constructor(private readonly canvas: HTMLCanvasElement, data?: ISceneData) {
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
        this.cons.forEach(c => this.mover.add(c));
        this.collisionSound.loop = true;
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
        this.cons.forEach(c => c.update(seconds));
        this.checkCollision();

        this.render(renderOptions);
    }

    checkCollision() {
        // check collision with cones
        const car = this.car;
        const cons = this.cons;

        let collision = false;
        for (const cone of cons) {
            const coneCollision = circleIntersectRectangle(cone, car.getRectangle());
            cone.setHit(coneCollision)
            collision = collision || coneCollision;
        }

        car.setHit(collision);

        if (collision) {
            this.collisionSound.play().catch(e => console.error(e));
        } else {
            this.collisionSound.pause();
            this.collisionSound.currentTime = 0;
        }
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