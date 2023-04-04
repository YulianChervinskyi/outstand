import {IControlsStates} from "../Controls";
import {EBonusType, ECellType, IPoint, ISceneObject, TField} from "../types";
import {BombModel} from "./BombModel";
import {BonusModel} from "./BonusModel";
import {BOMB_SPAMMING_TIME} from "../config";

const [abs, sign, round, min] = [Math.abs, Math.sign, Math.round, Math.min];

export class PlayerModel {
    readonly pos: IPoint = {x: 0, y: 0};
    private speed = 5;
    private bombPower = 2;
    private bombSupply = 3;
    private bombPushAbility = false;
    private bombSpamTime = 0;
    private activeBombs: BombModel[] = [];
    private validPlaces = [ECellType.Empty, ECellType.Explosion, ECellType.Bonus];
    private placeBomb?: (bomb: BombModel) => void;
    private getObject?: (pos: IPoint) => ISceneObject | undefined;

    constructor(private states: IControlsStates, private field: TField) {
    }

    setPlaceBomb(placeBomb: (bomb: BombModel) => void) {
        this.placeBomb = placeBomb;
    }

    setGetObject(func: (pos: IPoint) => ISceneObject | undefined) {
        this.getObject = func;
    }

    update(seconds: number) {
        this.updateMovement(seconds);

        if (this.bombSpamTime > 0)
            this.bombSpamTime -= seconds;

        if (this.bombSupply > 0 && (this.states.fire || this.bombSpamTime > 0))
            this.createBomb();
    }

    private createBomb() {
        const bombPos = {x: Math.round(this.pos.x), y: Math.round(this.pos.y)};

        if (this.field[bombPos.y][bombPos.x] !== ECellType.Empty)
            return;

        const newBomb = new BombModel(bombPos, this.bombPower, this.field, this.removeBomb);

        this.bombSupply -= 1;
        this.placeBomb?.(newBomb);
        this.activeBombs.push(newBomb);
    }

    private removeBomb = (bombToRemove: BombModel) => {
        this.bombSupply += 1;
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

        const sceneObject = this.getObject?.({x: col, y: row});

        if (sceneObject instanceof BonusModel)
            this.useBonus(sceneObject);
        else if (this.bombPushAbility && sceneObject instanceof BombModel)
            sceneObject.move({x: sign(col - this.pos.x), y: sign(row - this.pos.y)});

        return this.validPlaces.includes(this.field[row]?.[col]);
    }

    private useBonus(bonus: BonusModel) {
        switch (bonus.realType) {
            case EBonusType.Power:
                this.bombPower++;
                break;
            case EBonusType.Supply:
                this.bombSupply++;
                break;
            case EBonusType.Speed:
                this.speed++;
                break;
            case EBonusType.Push:
                this.bombPushAbility = true;
                break;
            case EBonusType.Spam:
                this.bombSpamTime += BOMB_SPAMMING_TIME;
                break;
        }
        bonus.detonate();
    }
}