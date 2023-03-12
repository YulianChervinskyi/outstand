import {ECellType, IPoint, TField} from "../types";
import {EXPLOSION_TIME} from "../config";

export class ExplosionModel {
    detonateBomb?: (pos: IPoint) => void;
    removeExplosion?: (explosion: ExplosionModel) => void;
    createExplosion?: (pos: IPoint, direction: IPoint, power: number) => void;
    delay = 0.1;
    lifetime = 0;

    constructor(private power: number, private field: TField, readonly pos: IPoint, readonly direction: IPoint | undefined) {
        this.power--;
    }

    private checkNextCell() {
        if (!this.createExplosion || this.power <= 0)
            return;

        const checkExceptions = (pos: IPoint) => {
            if (this.field[pos.y][pos.x] === ECellType.Wall)
                this.power = 1;
            else if (this.detonateBomb && this.field[pos.y][pos.x] === ECellType.Bomb)
                this.detonateBomb(pos);
        }

        if (!this.direction) {
            for (let y = 0; y < 2; y++) {
                for (let x = -1; x < 2; x += 2) {
                    const direction = {x: x * (1 - y), y: y * x};
                    const pos = {x: this.pos.x + direction.x, y: this.pos.y + direction.y};

                    if (this.field[pos.y]?.[pos.x] !== undefined && this.field[pos.y]?.[pos.x] !== ECellType.AzovSteel) {
                        checkExceptions(pos);
                        this.createExplosion(pos, direction, this.power);
                    }
                }
            }
        } else {
            const pos = {x: this.pos.x + this.direction.x, y: this.pos.y + this.direction.y};

            if (this.field[pos.y]?.[pos.x] === undefined || this.field[pos.y]?.[pos.x] === ECellType.AzovSteel)
                return;

            checkExceptions(pos);
            this.createExplosion(pos, this.direction, this.power);
        }
    }

    update(seconds: number) {
        this.lifetime += seconds;

        if (this.field[this.pos.y][this.pos.x] !== ECellType.Fire)
            this.field[this.pos.y][this.pos.x] = ECellType.Fire;

        if (this.lifetime >= this.delay && this.lifetime <= this.delay + seconds)
            this.checkNextCell();

        if (this.removeExplosion && this.lifetime >= EXPLOSION_TIME)
            this.removeExplosion(this);
    }

    setRemoveExplosion(func: (explosion: ExplosionModel) => void) {
        this.removeExplosion = func;
    }

    setAddExplosion(func: (pos: IPoint, direction: IPoint, power: number) => void) {
        this.createExplosion = func;
    }

    setDetonateBomb(func: (pos: IPoint) => void) {
        this.detonateBomb = func;
    }
}