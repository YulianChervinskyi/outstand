import {ECellType, IPoint, ISize} from "../types";
import {PlayerModel} from "./PlayerModel";

const [abs, sign, round, min] = [Math.abs, Math.sign, Math.round, Math.min];

export class GameModel {
    field: ECellType[][] = [];
    players: PlayerModel[];
    width: number = 0;
    height: number = 0;

    constructor(size: ISize, players: PlayerModel[]) {
        this.width = size.w;
        this.height = size.h;
        this.players = players;
        this.players.forEach(player => player.setCheckOffset(this.fixPlayerOffset.bind(this)));
        this.initField();
    }

    private initField() {
        for (let y = 0; y < this.height; y++) {
            this.field.push([]);
            for (let x = 0; x < this.width; x++) {
                if (y % 2 && x % 2 && x + y > 2)
                    this.field[y][x] = ECellType.AzovSteel;
                else if ((x + y <= 2) || (x + y) >= (this.height + this.width - 3))
                    this.field[y][x] = ECellType.Empty;
                else
                    this.field[y][x] = Math.random() < 0.1 ? ECellType.Wall : ECellType.Empty;
            }
        }
    }

    private fixPlayerOffset(pos: IPoint, offset: IPoint) {
        const o = this.fixBounds(pos, offset);
        const p = {x: pos.x, y: pos.y};

        let totalPath = abs(offset.x) + abs(offset.y);
        let iteration = 0;
        let axis1 = "x" as keyof IPoint;

        while (totalPath > 0) {
            const oldTotalPath = totalPath;

            if (o[axis1]) {
                const axis2 = axis1 === "x" ? "y" : "x" as keyof IPoint;
                const dev1 = round(p[axis1]) - p[axis1];    //deviation by main axis
                const sign1 = sign(o[axis1]);               //sign of offset by main axis
                const abs1 = abs(o[axis1]);                 //absolute main axis offset

                const isPathFree = () => {
                    const p1 = round(p[axis1] + o[axis1] + sign1 / 2);
                    const p2 = round(p[axis2]);
                    const p2beside = p2 - sign(p2 - p[axis2]);
                    return !this.isCellOccupied(p1, p2, axis1) && (p2=== p2beside || !this.isCellOccupied(p1, p2beside, axis1));
                }

                if (dev1) {
                    const maxDev1 = min(sign1 === sign(dev1) ? abs(dev1) : 1 - abs(dev1), abs1) * sign1;
                    totalPath -= abs(maxDev1);
                    p[axis1] += maxDev1;
                    o[axis1] -= maxDev1;
                } else if (isPathFree()) {
                    totalPath -= abs1;
                    p[axis1] += o[axis1];
                    o[axis1] = 0;
                } else if (!offset[axis2] && !this.isCellOccupied(p[axis1] + sign1, round(p[axis2]), axis1)) {
                    const dev2 = round(p[axis2]) - p[axis2];
                    const maxDev2 = min(abs1, abs(dev2));
                    o[axis2] += maxDev2 * sign(dev2);
                    o[axis1] -= maxDev2 * sign1;
                }
            }

            axis1 = axis1 === "x" ? "y" : "x" as keyof IPoint;
            iteration++;

            if (iteration % 4 === 0 && oldTotalPath === totalPath)
                break;
        }
        console.log("count:", iteration);
        return {x: p.x - pos.x, y: p.y - pos.y};
    }

    update(seconds: number) {
        this.players.forEach(p => p.update(seconds));
    }

    fixBounds(pos: IPoint, offset: IPoint) {
        const {x, y} = offset;
        return {
            x: pos.x + x < 0 ? -pos.x : pos.x + x > this.width - 1 ? this.width - 1 - pos.x : x,
            y: pos.y + y < 0 ? -pos.y : pos.y + y > this.height - 1 ? this.height - 1 - pos.y : y,
        };
    }

    isCellOccupied(v1: number, v2: number, axis: keyof IPoint = "x") {
        const row = axis === "x" ? v2 : v1;
        const col = axis === "x" ? v1 : v2;
        return this.field[row]?.[col] !== ECellType.Empty;
    }

}