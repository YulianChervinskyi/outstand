import {IControlsStates} from "../Controls";
import {ECellType, IPoint, ISceneObject, ISize, TField} from "../types";
import {PlayerModel} from "./PlayerModel";
import {BombModel} from "./BombModel";
import {ExplosionModel} from "./ExplosionModel";
import {BonusModel} from "./BonusModel";
import {FIELD_FILLING} from "../config";

export class GameModel {
    field: TField = [];
    sceneObjects: ISceneObject[] = [];
    players: PlayerModel[] = [];
    width: number = 0;
    height: number = 0;

    constructor(size: ISize) {
        this.width = size.w;
        this.height = size.h;
        this.initField();
    }

    createPlayer(states: IControlsStates) {
        const player = new PlayerModel(states, this.field);
        this.players.push(player);
        player.setPlaceBomb(this.addBomb.bind(this));
        return player;
    }

    update(seconds: number) {
        this.players.forEach(p => p.update(seconds));

        for (const o of this.sceneObjects) {
            if (!o.update(seconds))
                this.removeObject(o);
        }
    }

    private initField() {
        for (let y = 0; y < this.height; y++) {
            this.field.push([]);
            for (let x = 0; x < this.width; x++) {
                if (y % 2 && x % 2)
                    this.field[y][x] = ECellType.AzovSteel;
                else if (x + y <= 2 || x + y >= this.height + this.width - 3)
                    this.field[y][x] = ECellType.Empty;
                else
                    this.field[y][x] = Math.random() < FIELD_FILLING ? ECellType.Wall : ECellType.Empty;
            }
        }
    }

    private addBomb(bomb: BombModel) {
        this.sceneObjects.push(bomb);
        this.field[bomb.pos.y][bomb.pos.x] = ECellType.Bomb;
    }

    private addExplosion = (pos: IPoint, direction: IPoint | undefined, power: number) => {
        const explosion = new ExplosionModel(direction, power, this.field, pos);
        explosion.setDetonateObject(this.detonateObject);
        explosion.setCreateExplosion(this.addExplosion);
        this.sceneObjects.push(explosion);
    }

    private addBonus = (pos: IPoint) => {
        const bonus = new BonusModel(pos);
        this.sceneObjects.push(bonus);
        this.field[pos.y][pos.x] = ECellType.Bonus;
    }

    private removeObject = (object: ISceneObject) => {
        this.sceneObjects = this.sceneObjects.filter((o) => o !== object);
        this.field[object.pos.y][object.pos.x] = ECellType.Empty;

        if (object instanceof BombModel) {
            object.removeFromPlayer?.(object);
            this.addExplosion(object.pos, undefined, object.power);
        } else if (object instanceof ExplosionModel && object.isBonus) {
            this.addBonus(object.pos);
        }
    }

    private detonateObject = (pos: IPoint) => {
        this.sceneObjects?.forEach(o => {
            if (!(o instanceof ExplosionModel) && o.pos.x === pos.x && o.pos.y === pos.y)
                this.removeObject(o);
        });
    }
}