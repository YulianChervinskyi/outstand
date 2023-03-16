import {IControlsStates} from "../Controls";
import {ECellType, IPoint, ISceneObject, ISize, TField} from "../types";
import {PlayerModel} from "./PlayerModel";
import {BombModel} from "./BombModel";
import {ExplosionModel} from "./ExplosionModel";
import {BOMB_LIFETIME, BONUS_LIFETIME} from "../config";
import {BonusModel} from "./BonusModel";

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
                    this.field[y][x] = Math.random() < 0.1 ? ECellType.Wall : ECellType.Empty;
            }
        }
    }

    private addBomb(bomb: BombModel) {
        if (this.field[bomb.pos.y][bomb.pos.x] === ECellType.Bomb)
            return false;

        bomb.addEventListener("onExplosion", this.removeObject);
        this.sceneObjects.push(bomb);
        this.field[bomb.pos.y][bomb.pos.x] = ECellType.Bomb;

        return true;
    }

    private addExplosion = (pos: IPoint, direction: IPoint | undefined, power: number) => {
        const explosion = new ExplosionModel(direction, power, this.field, pos);
        explosion.setDetonateObject(this.detonateObject);
        explosion.setCreateExplosion(this.addExplosion);
        explosion.setCreateBonus(this.addBonus);
        this.sceneObjects.push(explosion);
    }

    private addBonus = (pos: IPoint) => {
        const bonus = new BonusModel(pos, this.field);
        this.sceneObjects.push(bonus);
        this.field[pos.y][pos.x] = ECellType.Bonus;
    }

    private removeObject = (object: ISceneObject) => {
        if (object instanceof BombModel) {
            object.removeEventListener("onExplosion", this.removeObject);
            this.addExplosion(object.pos, undefined, object.power);
        }

        this.sceneObjects = this.sceneObjects.filter((o) => o !== object);
        this.field[object.pos.y][object.pos.x] = ECellType.Empty;
    }

    private detonateObject = (pos: IPoint) => {
        this.sceneObjects?.forEach(o => {
            if (o.pos.x === pos.x && o.pos.y === pos.y)
                o.update(o instanceof BombModel ? BOMB_LIFETIME : BONUS_LIFETIME);
        });
    }
}