import {IControlsStates} from "../Controls";
import {EBonusType, ECellType, IFullPlayerState, IPlayerState, IPoint, ISceneObject, TField} from "../types";
import {BombModel} from "./BombModel";
import {BonusModel} from "./BonusModel";
import {BOMB_SPAMMING_TIME, DEATH_MOVING_TIME, IMMORTALITY_TIME, INIT_PLAYER_STATE} from "../config";

const [abs, sign, round, min] = [Math.abs, Math.sign, Math.round, Math.min];

export class PlayerModel {
    private deathPoint?: IPoint;

    private diarrhea = 0;
    private immortality = 0;
    private deathMovingMode: boolean = false;
    private currentSupply = INIT_PLAYER_STATE.maxSupply;
    private _state: IPlayerState = {...INIT_PLAYER_STATE};

    private activeBombs: BombModel[] = [];
    private validPlaces: ECellType[] = [ECellType.Empty, ECellType.Explosion, ECellType.Bonus];

    private placeBomb?: (bomb: BombModel) => void;
    private getObject?: (pos: IPoint) => ISceneObject | undefined;

    constructor(readonly pos: IPoint,
                private states: IControlsStates,
                private field: TField,
                private bonuses: EBonusType[]) {
    }

    setPlaceBomb(placeBomb: (bomb: BombModel) => void) {
        this.placeBomb = placeBomb;
    }

    setGetObject(func: (pos: IPoint) => ISceneObject | undefined) {
        this.getObject = func;
    }

    update(seconds: number) {
        this.updateMovement(seconds);

        if (this.deathMovingMode && !this.pos.x && !this.pos.y)
            this.deathMovingMode = false;

        if (!this.immortality && !this.deathMovingMode && this.field[round(this.pos.y)][round(this.pos.x)] === ECellType.Explosion)
            this.die();

        this.diarrhea = decrease(this.diarrhea, seconds);
        this.immortality = decrease(this.immortality, seconds);

        if (this.currentSupply > 0 && (this.states.place || this.diarrhea) && !this.deathMovingMode)
            this.createBomb();
    }

    get state(): IFullPlayerState {
        return {
            pos: this.pos,
            immortality: this.immortality,
            ...this._state,
            currSupply: this.currentSupply,
            diarrhea: this.diarrhea,
        };
    }

    private createBomb() {
        const bombPos = {x: round(this.pos.x), y: round(this.pos.y)};

        if (this.field[bombPos.y][bombPos.x] !== ECellType.Empty || this.getObject?.(bombPos))
            return;

        const newBomb = new BombModel(bombPos, this._state.power, this.field, this.bonuses, this.removeBomb);

        this.currentSupply -= 1;
        this.placeBomb?.(newBomb);
        this.activeBombs.push(newBomb);
    }

    store() {
        return {
            pos: this.pos,
            deathPoint: this.deathPoint,
            diarrhea: this.diarrhea,
            immortality: this.immortality,
            deathMovingMode: this.deathMovingMode,
            currentSupply: this.currentSupply,
            _state: this._state,
            activeBombs: this.activeBombs.map(o => o.store()),
        };
    }

    restore(obj: any) {
        this.pos.x = obj.pos.x;
        this.pos.y = obj.pos.y;

        this.deathPoint = obj.deathPoint;
        this.diarrhea = obj.diarrhea;
        this.immortality = obj.immortality;
        this.deathMovingMode = obj.deathMovingMode;
        this.currentSupply = obj.currentSupply;
        this._state = obj._state;

        this.activeBombs = obj.activeBombs.map((b: any) => {
            const bomb = BombModel.restore(b, this.field, this.bonuses, this.removeBomb);
            this.placeBomb?.(bomb);
            return bomb;
        });
    }

    private removeBomb = (bombToRemove: BombModel) => {
        this.currentSupply += this.currentSupply < this._state.maxSupply ? 1 : 0;
        this.activeBombs = this.activeBombs.filter((bomb) => bomb !== bombToRemove);
    }

    private updateMovement(seconds: number) {
        const x = this._state.speed * seconds * (Number(this.states.right) - Number(this.states.left));
        const y = this._state.speed * seconds * (Number(this.states.down) - Number(this.states.up));

        if (x || y || this.deathMovingMode) {
            const offset: IPoint = !this.deathMovingMode
                ? this.fixOffset(this.pos, {x, y})
                : {x: this.calcDeathStep(seconds, "x"), y: this.calcDeathStep(seconds, "y")};
            const diagCoefficient = !this.deathMovingMode && x && y && offset.x === x && offset.y === y ? 1 / Math.sqrt(2) : 1;
            this.walk({x: offset.x * diagCoefficient, y: offset.y * diagCoefficient});
        }
    }

    private calcDeathStep(seconds: number, axis: keyof IPoint = "x") {
        const step = this.deathPoint?.[axis] ? (-this.deathPoint?.[axis]) / DEATH_MOVING_TIME * seconds : 0;
        return this.pos[axis] + step <= 0 ? -this.pos[axis] : step;
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

        const sceneObject = this.getObject?.({x: round(p.x), y: round(p.y)});
        if (sceneObject instanceof BonusModel)
            this.useBonus(sceneObject);

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
        if (this._state.pushAbility && sceneObject instanceof BombModel)
            sceneObject.move({
                x: sign(col - this.pos.x),
                y: sign(row - this.pos.y),
            });

        return this.validPlaces.includes(this.field[row]?.[col]);
    }

    private die() {
        this.immortality = IMMORTALITY_TIME;
        this.diarrhea = 0;
        this.deathMovingMode = true;
        this.deathPoint = {x: this.pos.x, y: this.pos.y};
        this.currentSupply = INIT_PLAYER_STATE.maxSupply;
        this._state = {...INIT_PLAYER_STATE, ...{life: this._state.life -= 1}};
    }

    private useBonus(bonus: BonusModel) {
        switch (bonus.realType) {
            case EBonusType.Power:
                this._state.power++;
                break;
            case EBonusType.Supply:
                this.currentSupply++;
                this._state.maxSupply++;
                break;
            case EBonusType.Speed:
                this._state.speed++;
                break;
            case EBonusType.Push:
                this._state.pushAbility = true;
                break;
            case EBonusType.Spam:
                this.diarrhea += BOMB_SPAMMING_TIME;
                break;
        }
        bonus.detonate();
    }
}

function decrease(value: number, seconds: number) {
    return value > seconds ? value - seconds : 0;
}