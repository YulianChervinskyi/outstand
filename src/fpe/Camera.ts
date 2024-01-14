import {Bitmap, CIRCLE} from "./common";
import {Player} from "./Player";
import {Map, TRay} from "./Map";

export class Camera {
    private readonly ctx: CanvasRenderingContext2D;
    private width = this.canvas.width;
    private height = this.canvas.height;
    private spacing = this.width / this.resolution;
    private range = 14;
    private lightRange = 8;
    private scale = (this.width + this.height) / 1200;

    constructor(private canvas: HTMLCanvasElement, private resolution: number = 320, private focalLength: number = 0.8) {
        this.ctx = canvas.getContext('2d')!;
    }

    render(player: Player, map: Map) {
        this.drawSky(player.direction, map.skybox, map.light);
        this.drawColumns(player, map);
        this.drawWeapon(player.weapon, player.paces);
    };

    drawSky(direction: number, sky: Bitmap, ambient: number) {
        const width = sky.width * (this.height / sky.height);//  * 2;
        const left = (direction / CIRCLE) * -width;

        this.ctx.save();

        this.ctx.drawImage(sky.image, left, 0, width, this.height);
        if (left < width - this.width) {
            this.ctx.drawImage(sky.image, left + width, 0, width, this.height);
        }

        if (ambient > 0) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.globalAlpha = ambient * 0.1;
            this.ctx.fillRect(0, this.height * 0.5, this.width, this.height * 0.5);
        }

        this.ctx.restore();
    };

    drawColumns(player: Player, map: Map) {
        this.ctx.save();
        for (let column = 0; column < this.resolution; column++) {
            const y = column / this.resolution - 0.5;
            const angle = Math.atan2(y, this.focalLength);
            const ray = map.cast(player, player.direction + angle, this.range);
            this.drawColumn(column, ray, angle, map);
        }
        this.ctx.restore();
    };

    drawWeapon(weapon: Bitmap, paces: number) {
        const bobX = Math.cos(paces * 2) * this.scale * 6;
        const bobY = Math.sin(paces * 4) * this.scale * 6;
        const left = this.width * 0.66 + bobX;
        const top = this.height * 0.6 + bobY;
        this.ctx.drawImage(weapon.image, left, top, weapon.width * this.scale, weapon.height * this.scale);
    };

    drawColumn(column: number, ray: TRay, angle: number, map: Map) {
        const ctx = this.ctx;
        const texture = map.wallTexture;
        const left = Math.floor(column * this.spacing);
        const width = Math.ceil(this.spacing);

        let hit = -1;
        while (++hit < ray.length && ray[hit].height <= 0) {}

        for (let s = ray.length - 1; s >= 0; s--) {
            const step = ray[s];

            let rainDrops = Math.pow(Math.random(), 3) * s;
            const rain = (rainDrops > 0) && this.project(0.1, angle, step.distance);

            if (s === hit) {
                const textureX = Math.floor(texture.width * step.offset);
                const wall = this.project(step.height, angle, step.distance);

                ctx.globalAlpha = 1;
                ctx.drawImage(texture.image, textureX, 0, 1, texture.height, left, wall.top, width, wall.height);

                ctx.fillStyle = '#000000';
                ctx.globalAlpha = Math.max((step.distance + step.shading) / this.lightRange - map.light, 0.2);
                ctx.fillRect(left, wall.top, width, wall.height);
                // break; if not draw rain
            }

            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.15;

            if (rain)
                while (--rainDrops > 0) ctx.fillRect(left, Math.random() * rain.top, 1, rain.height);
        }
    };

    project(height: number, angle: number, distance: number) {
        const z = distance * Math.cos(angle);
        const wallHeight = this.height * height / z;
        const bottom = this.height / 2 * (1 + 1 / z);
        return {
            top: bottom - wallHeight,
            height: wallHeight
        };
    }
}
