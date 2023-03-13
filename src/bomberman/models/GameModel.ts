import {IControlsStates} from "../Controls";
import {ECellType, IPoint, ISize, TField} from "../types";
import {PlayerModel} from "./PlayerModel";
import {BombModel} from "./BombModel";
import {ExplosionModel} from "./ExplosionModel";
import {BOMB_LIFETIME} from "../config";

export class GameModel {
    field: TField = [];
    activeBombs: BombModel[] = [];
    explosions: ExplosionModel[] = [];
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
        this.activeBombs?.forEach(b => b.update(seconds));
        this.explosions?.forEach(e => e.update(seconds));
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

        bomb.addEventListener("onExplosion", this.removeBomb);
        this.activeBombs.push(bomb);
        this.field[bomb.pos.y][bomb.pos.x] = ECellType.Bomb;

        return true;
    }

    addExplosion = (pos: IPoint, direction: IPoint | undefined, power: number) => {
        const explosion = new ExplosionModel(direction, power, this.field, pos);
        explosion.setAddExplosion(this.addExplosion);
        explosion.setDetonateBomb(this.detonateBomb);
        explosion.setRemoveExplosion(this.removeExplosion);
        this.explosions.push(explosion);
    }

    private removeBomb = (bomb: BombModel) => {
        this.addExplosion(bomb.pos, undefined, bomb.power + 1);
        this.activeBombs = this.activeBombs.filter((b) => b !== bomb);
        bomb.removeEventListener("onExplosion", this.removeBomb);
    }

    removeExplosion = (explosion: ExplosionModel) => {
        this.explosions = this.explosions.filter((e) => e !== explosion);
        this.field[explosion.pos.y][explosion.pos.x] = ECellType.Empty;
    }

    detonateBomb = (pos: IPoint) => {
        this.activeBombs?.forEach(b => {
           if (b.pos.x === pos.x && b.pos.y === pos.y)
               b.update(BOMB_LIFETIME);
        });
    }
}