import {Player} from "./Player";
import {IOrigin, Map} from "./Map";

export class Camera {
    private readonly ctx: CanvasRenderingContext2D;
    private width = this.canvas.width;
    private height = this.canvas.height;
    private spacing = this.width / this.resolution;
    private range = 50;
    private renderTimes: number[] = [];

    constructor(private readonly canvas: HTMLCanvasElement,
                private readonly resolution = 320,
                private readonly focalLength = 0.8) {
        this.ctx = canvas.getContext('2d')!;
    }

    render(player: Player, map: Map, options: { showMap: boolean, showInfo: boolean }) {
        const time = performance.now();
        this.drawSky();
        this.drawColumns(player, map);
        options.showMap && this.drawMap(player, map);
        options.showInfo && this.drawInfo(player, performance.now() - time);
    }

    private drawSky() {
        this.ctx.save();

        this.ctx.fillStyle = '#00c4ff';
        this.ctx.fillRect(0, 0, this.width, this.height / 2);

        this.ctx.fillStyle = '#ffa600';
        this.ctx.fillRect(0, this.height / 2, this.width, this.height / 2);

        this.ctx.restore();
    };

    private drawColumns(player: Player, map: Map) {
        this.ctx.save();
        for (let column = 0; column < this.resolution; column++) {
            const y = column / this.resolution - 0.5;
            const angle = Math.atan2(y, this.focalLength);
            const ray = map.cast(player, player.direction + angle, this.range);
            this.drawColumn(map, column, angle, ray);
        }
        this.ctx.restore();
    };

    private drawColumn(map: Map, column: number, angle: number, ray: IOrigin) {
        // const texture = ray.wall === 1 ? wallTexture : wallTexture2;
        if (ray.wall < 255) {
            const ctx = this.ctx;

            ctx.fillStyle = 'rgb(47,70,36)';
            ctx.fillStyle = map.walls[ray.wall].color;
            ctx.globalAlpha = 1;
            const left = Math.floor(column * this.spacing);
            const width = Math.ceil(this.spacing);
            const wall = this.project(1, angle, ray.distance);
            ctx.fillRect(left, wall.top, width, wall.height);

            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.globalAlpha = Math.max(2 * ray.distance / this.range, 0);
            ctx.fillRect(left, wall.top, width, wall.height);
        }
        // ctx.drawImage(texture, ray.offset * texture.width, 0, 1, texture.height, left, top, width, bottom - top);
    }

    private project(height: number, angle: number, distance: number) {
        const z = distance * Math.cos(angle);
        const wallHeight = this.height * height / z;
        const bottom = this.height / 2 * (1 + 1 / z);
        return {
            top: bottom - wallHeight,
            height: wallHeight
        };
    }

    private drawInfo(player: Player, ms: number = 0) {

        this.ctx.save();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px monospace';
        this.ctx.fillText(`x: ${player.x.toFixed(2)}`, 4, 20);
        this.ctx.fillText(`y: ${player.y.toFixed(2)}`, 4, 40);
        this.ctx.fillText(`d: ${player.direction.toFixed(2)}`, 4, 60);

        this.renderTimes.push(ms);
        this.renderTimes.length > 30 && this.renderTimes.shift();
        const avg = this.renderTimes.reduce((a, b) => a + b) / this.renderTimes.length;
        this.ctx.fillText(`ms: ${avg.toFixed(2)}`, 4, 80);
        this.ctx.fillText(`fps: ${Math.round(1000 / avg)}`, 4, 100);

        this.ctx.restore();
    }

    private drawMap(player: Player, map: Map) {
        const ctx = this.ctx;
        ctx.save();

        const cSize = this.spacing * 6;
        const pSize = cSize * 0.5;
        const zx = (this.width - map.size * cSize) / 2;
        const zy = (this.height - map.size * cSize) / 2;

        for (let y = 0; y < map.size; y++) {
            for (let x = 0; x < map.size; x++) {
                const wall = map.wallGrid[y * map.size + x];
                if (wall < 255) {
                    ctx.fillStyle = map.walls[wall].color;
                    ctx.globalAlpha = 0.4;
                    ctx.fillRect(zx + x * cSize, zy + y * cSize, cSize, cSize);
                }
            }
        }

        ctx.fillStyle = 'red';
        ctx.globalAlpha = 1;
        ctx.fillRect(zx + player.x * cSize - pSize / 2, zy + player.y * cSize - pSize / 2, pSize, pSize);

        ctx.beginPath();
        for (let column = 0; column < this.resolution; column++) {
            const y = column / this.resolution - 0.5;
            const angle = Math.atan2(y, this.focalLength);
            const ray = map.cast(player, player.direction + angle, this.range);

            ctx.moveTo(zx + player.x * cSize, zy + player.y * cSize);
            if (ray.wall > 0) {
                ctx.lineTo(zx + ray.x * cSize, zy + ray.y * cSize);
            } else {
                const a = player.direction + angle;
                const rangeX = Math.cos(a) * this.range;
                const rangeY = Math.sin(a) * this.range;
                ctx.lineTo(zx + (player.x + rangeX) * cSize, zy + (player.y + rangeY) * cSize);
            }

        }
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.05)';
        ctx.stroke();
        ctx.restore();
    }
}