import {ECellType, IPoint, TField} from "../types";
import {EXPLOSION_TIME} from "../config";

export class ExplosionModel {
    removeExplosion?: (explosion: ExplosionModel) => void;
    createExplosion?: (pos: IPoint, direction: IPoint, power: number) => void;
    validateBounds?: (pos: IPoint, offset: IPoint) => IPoint;
    delay = 0.3;
    lifetime = 0;

    constructor(readonly power: number, private field: TField, readonly pos: IPoint, readonly direction: IPoint) {
        if (this.field[this.pos.y][this.pos.x] === ECellType.Wall)
            this.direction = {x: 0, y: 0};

        this.field[this.pos.y][this.pos.x] = ECellType.Fire;
        this.power--;
    }

    private checkNextCell() {
        if (!this.validateBounds || !this.createExplosion || this.power <= 0)
            return;

        const validDirection = this.validateBounds(this.pos, this.direction);

        if (validDirection.x + validDirection.y === 0)
            return;

        const nPos = {x: this.pos.x + validDirection.x, y: this.pos.y + validDirection.y};

        if (this.field[nPos.y][nPos.x] === ECellType.AzovSteel)
            return;

        this.createExplosion(nPos, validDirection, this.power);
    }

    update(seconds: number) {
        this.lifetime += seconds;

        if (this.lifetime >= this.delay && this.lifetime <= this.delay + seconds)
            this.checkNextCell();

        if (this.removeExplosion && this.lifetime >= EXPLOSION_TIME)
            this.removeExplosion(this);
    }

    setValidateBounds(func: (pos: IPoint, offset: IPoint) => IPoint) {
        this.validateBounds = func;
    }

    setRemoveExplosion(func: (explosion: ExplosionModel) => void) {
        this.removeExplosion = func;
    }

    setAddExplosion(func: (pos: IPoint, direction: IPoint, power: number) => void) {
        this.createExplosion = func;
    }
}