import {IPoint} from "../types";
import {EXPLOSION_TIME} from "../config";

export class ExplosionModel {
    explode?: (explosion: ExplosionModel) => void;
    lifetime = 0;

    constructor(readonly pos: IPoint) {
    }

    setExplode(explode: (explosion: ExplosionModel) => void) {
        this.explode = explode;
    }

    update(seconds: number) {
        this.lifetime += seconds;

        if (this.explode && this.lifetime >= EXPLOSION_TIME)
            this.explode(this);
    }
}