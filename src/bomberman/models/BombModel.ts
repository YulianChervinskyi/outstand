import {IPoint, ISceneObject} from "../types";
import {BOMB_LIFETIME} from "../config";

export class BombModel implements ISceneObject {
    removeFromPlayer?: (bomb: BombModel) => void;
    private lifetime = 0;

    constructor(readonly pos: IPoint, readonly power: number) {
    }

    update(seconds: number) {
        this.lifetime += seconds;
        return this.lifetime < BOMB_LIFETIME;
    }

    setRemoveFromPlayer(func: (bomb: BombModel) => void) {
        this.removeFromPlayer = func;
    }
}