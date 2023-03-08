import {IControlsStates} from "../Controls";
import {IPoint} from "../types";
import {BombModel} from "./BombModel";

export class PlayerModel {
    readonly pos: IPoint = {x: 0, y: 0};
    private readonly speed = 5;
    private bombSupply = 3;
    private activeBombs: BombModel[] = [];
    private fixOffset?: (pos: IPoint, offset: IPoint) => { x: number, y: number };
    private placeBomb?: (bombPos: IPoint) => (BombModel | undefined);

    constructor(private states: IControlsStates) {
    }

    setFixOffset(checkOffset: (pos: IPoint, offset: IPoint) => { x: number, y: number }) {
        this.fixOffset = checkOffset;
    }

    setPlaceBomb(placeBomb: (bombPos: IPoint) => (BombModel | undefined)) {
        this.placeBomb = placeBomb;
    }

    update(seconds: number) {
        this.updateMovement(seconds);

        if (this.states.fire && this.bombSupply > 0)
            this.createBomb();
    }

    private createBomb() {
        if (!this.placeBomb) return;

        const bombPos = {x: Math.round(this.pos.x), y: Math.round(this.pos.y)};
        const newBomb = this.placeBomb(bombPos);

        if (!newBomb) return;

        newBomb.addEventListener("onExplosion", this.removeBomb);

        this.bombSupply -= 1;
        this.activeBombs.push(newBomb);
    }

    private removeBomb = (bombToRemove: BombModel) => {
        this.bombSupply += 1;
        this.activeBombs[0].removeEventListener("onExplosion", this.removeBomb);
        this.activeBombs = this.activeBombs.filter((bomb) => bomb != bombToRemove);
    }

    private updateMovement(seconds: number) {
        if (!this.fixOffset)
            return;

        const x = this.speed * seconds * (Number(this.states.right) - Number(this.states.left));
        const y = this.speed * seconds * (Number(this.states.backward) - Number(this.states.forward));

        if (x || y) {
            const offset = this.fixOffset(this.pos, {x, y});
            const diagCoefficient = x && y && offset.x === x && offset.y === y ? 1 / Math.sqrt(2) : 1;
            this.walk({x: offset.x * diagCoefficient, y: offset.y * diagCoefficient});
        }
    }

    private walk(offset: { x: number, y: number }) {
        this.pos.x += offset.x;
        this.pos.y += offset.y;
    }
}