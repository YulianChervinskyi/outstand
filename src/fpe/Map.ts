import panorama from "./assets/deathvalley_panorama.jpg"
import wallTexture from "./assets/wall_texture.jpg"
import {Bitmap} from "./common";

export type TRay = IExOrigin[];

interface IOrigin {
    x: number,
    y: number,
    height: number,
    distance: number,
}

interface IExOrigin extends IOrigin {
    shading: number,
    offset: number,
}

interface IStep {
    length2: number,
    x: number,
    y: number,
}

// noinspection JSSuspiciousNameCombination
export class Map {
    wallGrid = new Uint8Array(this.size * this.size);
    skybox = new Bitmap(panorama, 2000, 750);
    wallTexture = new Bitmap(wallTexture, 1024, 1024);
    light = 0;

    constructor(readonly size: number, data?: number[]) {
        if (data && data.length === size * size) {
            this.wallGrid.set(data);
        } else {
            this.randomize();
        }
    }

    get(x: number, y: number) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return -1;
        return this.wallGrid[y * this.size + x];
    }

    cast(point: { x: number, y: number }, angle: number, range: number) {
        const self = this;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        const noWall = {length2: Infinity, x: NaN, y: NaN};

        return ray({x: point.x, y: point.y, height: 0, distance: 0, offset: 0, shading: 0});

        function ray(origin: IExOrigin): TRay {
            const stepX = step(sin, cos, origin.x, origin.y);
            const stepY = step(cos, sin, origin.y, origin.x, true);
            const nextStep = stepX.length2 < stepY.length2
                ? inspect(stepX, 1, 0, origin.distance, stepX.y)
                : inspect(stepY, 0, 1, origin.distance, stepY.x);

            if (nextStep.distance > range)
                return [origin];

            ////// it is enough if there is a wall and if is not needed to draw rain
            // if (nextStep.height > 0)
            //     return [nextStep];

            return [origin].concat(ray(nextStep));
        }

        function step(rise: number, run: number, x: number, y: number, inverted: boolean = false) {
            if (run === 0) return noWall;
            const dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
            const dy = dx * (rise / run);
            return {
                x: inverted ? y + dy : x + dx,
                y: inverted ? x + dx : y + dy,
                length2: dx * dx + dy * dy,
            };
        }

        function inspect(step: IStep, shiftX: number, shiftY: number, distance: number, offset: number): IExOrigin {
            const result: IExOrigin = {x: step.x, y: step.y, height: 0, distance: 0, shading: 0, offset: 0};
            const dx = cos < 0 ? shiftX : 0;
            const dy = sin < 0 ? shiftY : 0;

            result.height = self.get(step.x - dx, step.y - dy);
            result.distance = distance + Math.sqrt(step.length2);
            result.offset = offset - Math.floor(offset);

            if (shiftX)
                result.shading = cos < 0 ? 2 : 0;
            else
                result.shading = sin < 0 ? 2 : 1;

            return result;
        }
    }

    update(seconds: number) {
        if (this.light > 0)
            this.light = Math.max(this.light - 10 * seconds, 0);
        else if (Math.random() * 5 < seconds)
            this.light = 2;
    }

    private randomize() {
        for (let i = 0; i < this.size * this.size; i++) {
            this.wallGrid[i] = Math.random() < 0.3 ? 1 : 0;
        }
    }
}
