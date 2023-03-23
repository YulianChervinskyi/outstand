import {EBonusType, IPoint, ISceneObject} from "../types";
import {BONUS_LIFETIME} from "../config";

export class BonusModel implements ISceneObject {
    private lifetime = 0;
    type: EBonusType | undefined;

    constructor(readonly pos: IPoint) {
        this.type = this.defineType();
    }

    detonate(): void {
        this.lifetime = BONUS_LIFETIME;
    }

    update(seconds: number) {
        this.lifetime += seconds;
        return this.lifetime < BONUS_LIFETIME;
    }

    get generatedObject(): ISceneObject | undefined {
        return undefined;
    }

    private defineType() {
        // TODO logic
        return EBonusType.BombSupply;
    }
}