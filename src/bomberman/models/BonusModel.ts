import {EBonusType, ECellType, IPoint, ISceneObject, TField} from "../types";
import {BONUS_LIFETIME} from "../config";

type ERealBonus = Exclude<EBonusType, EBonusType.Lottery>;

export class BonusModel implements ISceneObject {
    readonly realType: ERealBonus;
    private lifetime = 0;

    type = this.constructor.name;

    constructor(readonly pos: IPoint, private field: TField, readonly _type: EBonusType, private bonuses: EBonusType[]) {
        this.realType = _type === EBonusType.Lottery ? this.defineType() : _type;
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

    get _lifetime(): number {
        return this.lifetime;
    }

    private defineType() {
        const suitableBonuses = this.bonuses.filter(bonus => bonus !== EBonusType.Lottery) as ERealBonus[];
        return suitableBonuses[Math.floor(Math.random() * suitableBonuses.length)];
    }

    store(): any {
        return {
            field: [],
            pos: this.pos,
            type: this.type,
            _type: this._type,
            lifetime: this.lifetime,
        };
    }

    static restore(obj: any, field: TField, bonuses: EBonusType[]) {
        const bonus = new BonusModel(obj.pos, field, obj._type, bonuses);
        bonus.lifetime = obj.lifetime;

        return bonus;
    }
}