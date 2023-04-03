import {ECellType, IPoint, ISceneObject, TField} from "../types";
import {BONUS_LIFETIME} from "../config";

export class BonusModel implements ISceneObject {
    private lifetime = 0;

    constructor(readonly pos: IPoint, private field: TField, readonly type: number) {
    }

    detonate(): void {
        this.lifetime = BONUS_LIFETIME;
    }

    update(seconds: number) {
        this.lifetime += seconds;

        if (this.field[this.pos.y][this.pos.x] !== ECellType.Bonus)
            this.field[this.pos.y][this.pos.x] = ECellType.Bonus;

        return this.lifetime < BONUS_LIFETIME;
    }

    get generatedObject(): ISceneObject | undefined {
        return undefined;
    }
}