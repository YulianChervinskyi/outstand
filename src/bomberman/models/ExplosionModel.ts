import {EXPLOSION_LIFETIME, EXPLOSION_SPAWN_DELAY} from "../config";
import {EBonusType, ECellType, IPoint, ISceneObject, TField} from "../types";
import {BonusModel} from "./BonusModel";

export class ExplosionModel implements ISceneObject {
    private validPlaces = [ECellType.Empty, ECellType.Bonus, ECellType.Explosion];
    private _generatedObject?: ISceneObject;
    private lifetime = 0;

    type = this.constructor.name;

    constructor(readonly pos: IPoint,
                private power: number,
                private field: TField,
                private addObject: (object: ISceneObject) => void,
                private detonateObject: (pos: IPoint) => void,
                private bonuses: EBonusType[],
                readonly direction?: IPoint) {
        this.checkExplosionPlace();
    }

    detonate(): void {
    }

    get generatedObject(): ISceneObject | undefined {
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

        if (place !== ECellType.Wall)
            return;

        const wallNumber = this.field.reduce((acc, row) =>
            acc + row.reduce((acc, cell) => acc + Number(cell === ECellType.Wall), 0), 0);

        const typeIndex = Math.floor(Math.random() * wallNumber);
        const type = this.bonuses[typeIndex];

        console.log("before:", this.bonuses.length);
        if (type !== undefined && !this._generatedObject) {
            this._generatedObject = new BonusModel(this.pos, this.field, type, this.bonuses);
            this.bonuses.splice(typeIndex, 1);
        }
        console.log("after:", this.bonuses.length);
    }

    private validateExpansion(pos: IPoint) {
        return this.validPlaces.includes(this.field[pos.y]?.[pos.x]);
    }

    private spawn() {
        if (this.power <= 0)
            return;

        const directions = this.direction
            ? [this.direction]
            : [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}];

        for (let direction of directions) {
            const pos = {x: this.pos.x + direction.x, y: this.pos.y + direction.y};
            const power = this.validateExpansion(pos) ? this.power - 1 : 0;

            if (this.field[pos.y]?.[pos.x] === undefined || this.field[pos.y]?.[pos.x] === ECellType.AzovSteel)
                continue;

            const explosion = new ExplosionModel(pos, power, this.field, this.addObject, this.detonateObject, this.bonuses, direction);
            this.addObject(explosion);
        }
        this.power = 0;
    }

    store(): any {
        return {
            field: [],
            pos: this.pos,
            type: this.type,
            power: this.power,
            lifetime: this.lifetime,
            direction: this.direction,
            _generatedObject: this._generatedObject?.store(),
        };
    }

    static restore(obj: any, field: TField, bonuses: EBonusType[], addObject: (object: ISceneObject) => void, detonateObject: (pos: IPoint) => void) {
        const explosion = new ExplosionModel(obj.pos, obj.power, field, addObject, detonateObject, bonuses, obj?.direction);

        if (obj._generatedObject)
            explosion._generatedObject = BonusModel.restore(obj._generatedObject, explosion.field, bonuses);

        explosion.lifetime = obj.lifetime;

        return explosion;
    }
}