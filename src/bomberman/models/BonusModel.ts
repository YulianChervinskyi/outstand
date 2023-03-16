import {EBonusType, IPoint, ISceneObject} from "../types";
import {BONUS_LIFETIME} from "../config";

export class BonusModel implements ISceneObject {
    private lifetime = 0;
    type: EBonusType | undefined;

    constructor(readonly pos: IPoint) {
        this.type = this.defineType();
    }

    update(seconds: number) {
        this.lifetime += seconds;
        return this.lifetime < BONUS_LIFETIME;
    }

    private defineType() {
        return EBonusType.BombSupply;
    }
}