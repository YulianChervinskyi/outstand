import {IControlsStates} from "../Controls";
import {ECellType, IPoint} from "../types";
import {BombModel} from "./BombModel";
import {EXPLOSION_TIME} from "../config";

export class PlayerModel {
    readonly pos: IPoint = {x: 0, y: 0};
    readonly speed = 5;
    private bombSupply = 3;
    private activeBombs: BombModel[] = [];
    private fixOffset?: (pos: IPoint, offset: IPoint) => { x: number, y: number };
    private changeFieldCell?: (pos: IPoint, cell: ECellType) => void;

    constructor(private states: IControlsStates) {
    }

    setFixOffset(checkOffset: (pos: IPoint, offset: IPoint) => { x: number, y: number }) {
        this.fixOffset = checkOffset;
    }

    setBombOnField(changeFieldCell: (pos: IPoint, cell: ECellType) => void) {
        this.changeFieldCell = changeFieldCell;
    }

    update(seconds: number) {
        const currTime = performance.now() / 1000;

        this.updateMovement(seconds);

        if (this.states.fire && this.bombSupply > 0)
            this.createBomb();

        this.activeBombs.forEach((bomb) => {
            const bombLifeTime = Math.floor(currTime) - EXPLOSION_TIME;

            if (bombLifeTime >= Math.round(bomb.spawnTime))
                this.removeBomb(bomb.spawnPos);
        });

    }

    createBomb() {
        if (!this.changeFieldCell)
            return;

        const prevBombPos = this.activeBombs.length ? {
            x: Math.round(this.activeBombs[this.activeBombs.length - 1].spawnPos.x),
            y: Math.round(this.activeBombs[this.activeBombs.length - 1].spawnPos.y),
        } : undefined;

        if (prevBombPos?.x === Math.round(this.pos.x) && prevBombPos?.y === Math.round(this.pos.y))
            return;

        this.bombSupply -= 1;
        this.activeBombs.push(new BombModel(this.pos));
        this.changeFieldCell(this.pos, ECellType.Bomb);
        console.log(this.activeBombs);
    }

    removeBomb(spawnPos: IPoint) {
        if (!this.changeFieldCell || !spawnPos)
            return;

        this.bombSupply += 1;
        this.activeBombs.splice(0, 1);
        this.changeFieldCell(spawnPos, ECellType.Empty);
        console.log(this.activeBombs);
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