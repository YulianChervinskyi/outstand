import {IPoint, ISceneObject, TField} from "../types";
import {BOMB_LIFETIME} from "../config";
import {ExplosionModel} from "./ExplosionModel";

export class BombModel implements ISceneObject {
    removeFromPlayer?: (bomb: BombModel) => void;
    private _generatedObject: ISceneObject | undefined;
    private lifetime = 0;

    constructor(readonly pos: IPoint, readonly power: number, private field: TField) {
    }

    update(seconds: number) {
        this.lifetime += seconds;

        if (this.lifetime >= BOMB_LIFETIME)
            this._generatedObject = new ExplosionModel(undefined, this.power, this.field, this.pos);

        return this.lifetime < BOMB_LIFETIME;
    }

    get generatedObject(): ISceneObject | undefined {
        return this._generatedObject;
    }

    setRemoveFromPlayer(func: (bomb: BombModel) => void) {
        this.removeFromPlayer = func;
    }
}