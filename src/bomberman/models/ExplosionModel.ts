import {ECellType, IPoint, ISceneObject, TField} from "../types";
import {BONUS_GENERATION_CHANCE, EXPLOSION_LIFETIME, EXPLOSION_SPAWN_DELAY} from "../config";
import {BonusModel} from "./BonusModel";

export class ExplosionModel implements ISceneObject {
    private _generatedObject: ISceneObject | undefined;
    private lifetime = 0;

    constructor(readonly pos: IPoint,
                private power: number,
                private field: TField,
                private addObject: (object: ISceneObject) => void,
                private detonateObject: (pos: IPoint) => void,
                readonly direction?: IPoint) {
        this.checkExplosionPlace();
    }

    detonate(): void {
    }

    get generatedObject(): ISceneObject | undefined {
        if (this._generatedObject)
            this.field[this.pos.y][this.pos.x] = ECellType.Bonus;

        return this._generatedObject;
    }

    update(seconds: number) {
        this.lifetime += seconds;

        if (this.field[this.pos.y]?.[this.pos.x] !== ECellType.Explosion)
            this.field[this.pos.y][this.pos.x] = ECellType.Explosion;

        if (this.lifetime >= EXPLOSION_SPAWN_DELAY)
            this.spawn();

        return this.lifetime < EXPLOSION_LIFETIME;
    }

    private checkExplosionPlace() {
        const place = this.field[this.pos.y]?.[this.pos.x];
        this.power = place === ECellType.Bomb ? 0 : this.power;
        this.lifetime = place === ECellType.Bomb ? EXPLOSION_LIFETIME : 0;

        if ([ECellType.Bomb, ECellType.Bonus].includes(place))
            this.detonateObject?.(this.pos);
        else if (place === ECellType.Wall && Math.random() <= BONUS_GENERATION_CHANCE)
            this._generatedObject = new BonusModel(this.pos);
    }

    private spawn() {
        if (this.power <= 0)
            return;

        for (let y = 0; y < 2; y++) {
            for (let x = -1; x < 2; x += 2) {
                const direction = this.direction ? this.direction : {x: x * (1 - y), y: y * x};
                const pos = {x: this.pos.x + direction.x, y: this.pos.y + direction.y};
                const power = [ECellType.Empty, ECellType.Bonus, ECellType.Explosion].includes(this.field[pos.y]?.[pos.x]) ? this.power - 1 : 0;

                if (this.field[pos.y]?.[pos.x] === undefined || this.field[pos.y]?.[pos.x] === ECellType.AzovSteel)
                    continue;

                const explosion = new ExplosionModel(pos, power, this.field, this.addObject, this.detonateObject, direction);
                this.addObject(explosion);

                if (direction === this.direction)
                    break;
            }
        }
        this.power = 0;
    }
}