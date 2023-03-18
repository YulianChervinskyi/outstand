import {ECellType, IPoint, ISceneObject, TField} from "../types";
import {BONUS_GENERATION_CHANCE, EXPLOSION_LIFETIME, EXPLOSION_SPAWN_DELAY} from "../config";

export class ExplosionModel implements ISceneObject {
    detonateObject?: (pos: IPoint) => void;
    createExplosion?: (pos: IPoint, direction: IPoint, power: number) => void;
    private lifetime = 0;
    isBonus = false;

    constructor(readonly direction: IPoint | undefined,
                private power: number,
                private field: TField,
                readonly pos: IPoint) {
    }

    private spawn() {
        if (this.power <= 0)
            return;

        const getNextExplosionPower = (pos: IPoint) => {
            return [ECellType.Empty, ECellType.Bonus].includes(this.field[pos.y][pos.x]) ? this.power - 1 : 0;
        }

        if (!this.direction) {
            for (let y = 0; y < 2; y++) {
                for (let x = -1; x < 2; x += 2) {
                    const direction = {x: x * (1 - y), y: y * x};
                    const pos = {x: this.pos.x + direction.x, y: this.pos.y + direction.y};

                    if (this.field[pos.y]?.[pos.x] !== undefined && this.field[pos.y]?.[pos.x] !== ECellType.AzovSteel)
                        this.createExplosion?.(pos, direction, getNextExplosionPower(pos));
                }
            }
        } else {
            const pos = {x: this.pos.x + this.direction.x, y: this.pos.y + this.direction.y};

            if (this.field[pos.y]?.[pos.x] === undefined || this.field[pos.y]?.[pos.x] === ECellType.AzovSteel)
                return;

            this.createExplosion?.(pos, this.direction, getNextExplosionPower(pos));
        }
        this.power = 0;
    }

    update(seconds: number) {
        const explosionCell = this.field[this.pos.y][this.pos.x];

        if (explosionCell === ECellType.Bomb) {
            this.detonateObject?.(this.pos);
            return false;
        }

        if (explosionCell === ECellType.Bonus)
            this.detonateObject?.(this.pos);
        else if (explosionCell === ECellType.Wall && Math.random() <= BONUS_GENERATION_CHANCE)
            this.isBonus = true;

        if (this.field[this.pos.y][this.pos.x] !== ECellType.Explosion)
            this.field[this.pos.y][this.pos.x] = ECellType.Explosion;

        this.lifetime += seconds;

        if (this.lifetime >= EXPLOSION_SPAWN_DELAY)
            this.spawn();

        return this.lifetime < EXPLOSION_LIFETIME;
    }

    setCreateExplosion(func: (pos: IPoint, direction: IPoint, power: number) => void) {
        this.createExplosion = func;
    }

    setDetonateObject(func: (pos: IPoint) => void) {
        this.detonateObject = func;
    }
}