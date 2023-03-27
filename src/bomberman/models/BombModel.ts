import {ECellType, IPoint, ISceneObject, TField} from "../types";
import {BOMB_LIFETIME} from "../config";
import {ExplosionModel} from "./ExplosionModel";

export class BombModel implements ISceneObject {
    private lifetime = 0;
    private validPlaces = [ECellType.Empty, ECellType.Explosion];
    private detonateObject: (pos: IPoint) => void = () => {
    };
    private addObject: (object: ISceneObject) => void = () => {
    };

    constructor(
        readonly pos: IPoint,
        readonly power: number,
        private field: TField,
        private onDetonate: (bomb: BombModel) => void,
    ) {
    }

    detonate(): void {
        this.lifetime = BOMB_LIFETIME;
    }

    update(seconds: number) {
        this.lifetime += seconds;
        const isAlive = this.lifetime < BOMB_LIFETIME;

        if (this.field[this.pos.y][this.pos.x] !== ECellType.Bomb)
            this.field[this.pos.y][this.pos.x] = ECellType.Bomb;

        if (!isAlive)
            this.onDetonate(this);

        return isAlive;
    }

    setListeners(addObject: (object: ISceneObject) => void, detonateObject: (pos: IPoint) => void) {
        this.addObject = addObject;
        this.detonateObject = detonateObject;
    }

    move(offset: IPoint) {
        const pos = {x: this.pos.x + offset.x, y: this.pos.y + offset.y}

        if (!this.validPlaces.includes(this.field[pos.y]?.[pos.x]) || offset.x && offset.y)
            return;

        this.field[this.pos.y][this.pos.x] = ECellType.Empty;
        this.pos.x = pos.x;
        this.pos.y = pos.y;
    }

    get generatedObject(): ISceneObject | undefined {
        return new ExplosionModel(this.pos, this.power, this.field, this.addObject, this.detonateObject);
    }
}