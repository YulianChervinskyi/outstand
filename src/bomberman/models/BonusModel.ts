import {EBonusType, ECellType, IPoint, ISceneObject, TField} from "../types";
import {BONUS_LIFETIME} from "../config";
import {bonuses} from "./GameModel";

export class BonusModel implements ISceneObject {
    private lifetime = 0;

    constructor(readonly pos: IPoint, private field: TField, private type: number) {
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

    changeType(): BonusModel {
        while (true) {
            const index = Math.floor(Math.random() * (bonuses.length - 1));

            if (bonuses[index] !== EBonusType.Lottery) {
                this.type = bonuses[index];
                bonuses.splice(index, 1);
                return this;
            }
        }
    }

    get generatedObject(): ISceneObject | undefined {
        return undefined;
    }

    get getType(): number {
        return this.type;
    }
}