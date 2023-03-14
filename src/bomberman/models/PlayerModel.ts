import {IControlsStates} from "../Controls";
import {ECellType, IPoint, TField} from "../types";
import {BombModel} from "./BombModel";

const [abs, sign, round, min] = [Math.abs, Math.sign, Math.round, Math.min];

export class PlayerModel {
    readonly pos: IPoint = {x: 0, y: 0};
    private speed = 5;
    private bombPower = 2;
    private bombSupply = 3;
    private activeBombs: BombModel[] = [];
    private placeBomb?: (bomb: BombModel) => boolean;

    constructor(private states: IControlsStates, private field: TField) {
    }

    setPlaceBomb(placeBomb: (bomb: BombModel) => boolean) {
        this.placeBomb = placeBomb;
    }

    update(seconds: number) {
        this.updateMovement(seconds);

        if (this.states.fire && this.bombSupply > 0)
            this.createBomb();
    }

    private createBomb() {
        if (!this.placeBomb)
            return;

        const bombPos = {x: Math.round(this.pos.x), y: Math.round(this.pos.y)};
        const newBomb = new BombModel(bombPos, this.bombPower);

        if (!this.placeBomb(newBomb))
            return;

        newBomb.addEventListener("onExplosion", this.removeBomb);

        this.bombSupply -= 1;
        this.activeBombs.push(newBomb);
    }

    private removeBomb = (bombToRemove: BombModel) => {
        this.bombSupply += 1;
        this.activeBombs[0].removeEventListener("onExplosion", this.removeBomb);
        this.activeBombs = this.activeBombs.filter((bomb) => bomb !== bombToRemove);
    }

    private updateMovement(seconds: number) {
        const x = this.speed * seconds * (Number(this.states.right) - Number(this.states.left));
        const y = this.speed * seconds * (Number(this.states.backward) - Number(this.states.forward));

        if (x || y) {
            const offset = this.fixOffset(this.pos, {x, y});
            const diagCoefficient = x && y && offset.x === x && offset.y === y ? 1 / Math.sqrt(2) : 1;
            this.walk({x: offset.x * diagCoefficient, y: offset.y * diagCoefficient});
        }
    }

    private walk(offset: { x: number, y: number }) {
        this.pos.x += offset.x;
        this.pos.y += offset.y;
    }

    private fixOffset(pos: IPoint, offset: IPoint) {
        const o = this.validateBounds(pos, offset);
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

    private validateBounds(pos: IPoint, offset: IPoint) {
        const {x, y} = offset;
        const [width, height] = [this.field[0]?.length, this.field.length];
        return {
            x: pos.x + x < 0 ? -pos.x : pos.x + x > width - 1 ? width - 1 - pos.x : x,
            y: pos.y + y < 0 ? -pos.y : pos.y + y > height - 1 ? height - 1 - pos.y : y,
        };
    }

    private isCellEmpty(cA1: number, cA2: number, axis: keyof IPoint = "x") {
        const row = axis === "x" ? cA2 : cA1;
        const col = axis === "x" ? cA1 : cA2;
        return this.field[row]?.[col] === ECellType.Empty;
    }
}