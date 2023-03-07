import {IControlsStates} from "../Controls";
import {IPoint} from "../types";
import {BombModel} from "./BombModel";

export class PlayerModel {
    readonly pos: IPoint = {x: 0, y: 0};
    readonly speed = 5;
    private bombSupply = 3;
    private activeBombs: BombModel[] = [];
    private fixOffset?: (pos: IPoint, offset: IPoint) => { x: number, y: number };
    private addBombOnField?: (bomb: BombModel) => void;

    constructor(private states: IControlsStates) {
    }

    setFixOffset(checkOffset: (pos: IPoint, offset: IPoint) => { x: number, y: number }) {
        this.fixOffset = checkOffset;
    }

    setBombOnField(addBombOnField: (bomb: BombModel) => void) {
        this.addBombOnField = addBombOnField;
    }

    update(seconds: number) {
        this.updateMovement(seconds);

        if (this.states.fire && this.bombSupply > 0)
            this.createBomb();
    }

    createBomb() {
        if (!this.addBombOnField)
            return;

        const bombPos = {x: Math.round(this.pos.x), y: Math.round(this.pos.y)};

        const prevBombPos = {
            x: Math.round(this.activeBombs[this.activeBombs.length - 1]?.spawnPos.x),
            y: Math.round(this.activeBombs[this.activeBombs.length - 1]?.spawnPos.y),
        };

        if (prevBombPos.x === bombPos.x && prevBombPos.y === bombPos.y)
            return;

        const currTime = performance.now() / 1000;
        const newBomb = new BombModel(currTime, bombPos);

        newBomb.addEventListener("onExplosion", this.removeBomb.bind(this));

        this.bombSupply -= 1;
        this.addBombOnField(newBomb);
        this.activeBombs.push(newBomb);
    }

    removeBomb(bombToRemove: BombModel) {
        this.bombSupply += 1;
        this.activeBombs[0].removeEventListener("onExplosion", this.removeBomb.bind(this));
        this.activeBombs = this.activeBombs.filter((bomb) => bomb != bombToRemove);
    }

    updateMovement(seconds: number) {
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

    walk(offset: { x: number, y: number }) {
        this.pos.x += offset.x;
        this.pos.y += offset.y;
    }
}