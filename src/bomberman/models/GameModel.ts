import {ECellType, IPoint, ISize} from "../types";
import {PlayerModel} from "./PlayerModel";
import {BombModel} from "./BombModel";

const [abs, sign, round, min] = [Math.abs, Math.sign, Math.round, Math.min];

export class GameModel {
    field: ECellType[][] = [];
    activeBombs: BombModel[] = [];
    players: PlayerModel[];
    width: number = 0;
    height: number = 0;

    constructor(size: ISize, players: PlayerModel[]) {
        this.width = size.w;
        this.height = size.h;
        this.players = players;
        this.players.forEach((player) => {
            player.setFixOffset(this.fixPlayerOffset.bind(this));
            player.setBombOnField(this.addBomb.bind(this));
        });
        this.initField();
    }

    update(seconds: number) {
        this.players.forEach(p => p.update(seconds));
        this.activeBombs?.forEach(b => b.update())
    }

    private initField() {
        for (let y = 0; y < this.height; y++) {
            this.field.push([]);
            for (let x = 0; x < this.width; x++) {
                if (y % 2 && x % 2)
                    this.field[y][x] = ECellType.AzovSteel;
                else if (x + y <= 2 || x + y >= this.height + this.width - 3)
                    this.field[y][x] = ECellType.Empty;
                else
                    this.field[y][x] = Math.random() < 0.1 ? ECellType.Wall : ECellType.Empty;
            }
        }
    }

    private addBomb(bomb: BombModel) {
        this.activeBombs.push(bomb);
        bomb.addEventListener("onExplosion", this.removeBomb.bind(this));
        this.field[bomb.spawnPos.y][bomb.spawnPos.x] = ECellType.Bomb;
    }

    private removeBomb(bombToRemove: BombModel) {
        this.activeBombs = this.activeBombs.filter((bomb) => bomb !== bombToRemove);
        bombToRemove.removeEventListener("onExplosion", this.removeBomb.bind(this));
        this.field[bombToRemove.spawnPos.y][bombToRemove.spawnPos.x] = ECellType.Empty;
    }

    private fixPlayerOffset(pos: IPoint, offset: IPoint) {
        const o = this.fixBounds(pos, offset);
        const p = {x: pos.x, y: pos.y};
        let axis1 = "x" as keyof IPoint;

        for (let i = 0; i < 3 && abs(o.x) + abs(o.y) > 0; i++) {
            if (o[axis1]) {
                const axis2 = axis1 === "x" ? "y" : "x" as keyof IPoint;
                const devA1 = round(p[axis1]) - p[axis1];    //deviation by main axis
                const signA1 = sign(o[axis1]);               //sign of offset by main axis
                const absA1 = abs(o[axis1]);                 //absolute main axis offset

                const isPathFree = () => {
                    const cA1 = round(p[axis1] + o[axis1] + signA1 / 2);
                    const cA2 = round(p[axis2]);
                    const signA2 = sign(cA2 - p[axis2]);
                    return this.isCellEmpty(cA1, cA2, axis1) && (!signA2 || this.isCellEmpty(cA1, cA2 - signA2, axis1));
                }

                if (devA1) {
                    // if player is not on the cell center
                    const maxDevA1 = min(signA1 === sign(devA1) ? abs(devA1) : 1 - abs(devA1), absA1) * signA1;
                    p[axis1] += maxDevA1;
                    o[axis1] -= maxDevA1;
                } else if (isPathFree()) {
                    // if player is on the cell center and path is free
                    p[axis1] += o[axis1];
                    o[axis1] = 0;
                } else if (!offset[axis2]) {
                    // if player is on the cell center and path is blocked by wall
                    const cA1 = p[axis1] + signA1;
                    const cA2 = round(p[axis2]);
                    let devA2 = cA2 - p[axis2];

                    if (!this.isCellEmpty(cA1, cA2, axis1))
                        devA2 = this.isCellEmpty(cA1, cA2 - sign(devA2), axis1) ? devA2 - sign(devA2) : 0;

                    const maxDevA2 = min(absA1, abs(devA2));
                    o[axis2] += maxDevA2 * sign(devA2);
                    o[axis1] -= maxDevA2 * signA1;
                }
            }
            axis1 = axis1 === "x" ? "y" : "x" as keyof IPoint;
        }
        return {x: p.x - pos.x, y: p.y - pos.y};
    }

    private fixBounds(pos: IPoint, offset: IPoint) {
        const {x, y} = offset;
        return {
            x: pos.x + x < 0 ? -pos.x : pos.x + x > this.width - 1 ? this.width - 1 - pos.x : x,
            y: pos.y + y < 0 ? -pos.y : pos.y + y > this.height - 1 ? this.height - 1 - pos.y : y,
        };
    }

    private isCellEmpty(cA1: number, cA2: number, axis: keyof IPoint = "x") {
        const row = axis === "x" ? cA2 : cA1;
        const col = axis === "x" ? cA1 : cA2;
        return this.field[row]?.[col] === ECellType.Empty;
    }
}