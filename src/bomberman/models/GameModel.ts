import {IControlsStates} from "../Controls";
import {ECellType, IPoint, ISize, TField} from "../types";
import {PlayerModel} from "./PlayerModel";
import {BombModel} from "./BombModel";
import {ExplosionModel} from "./ExplosionModel";

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

    private removeBomb = (bomb: BombModel) => {
        this.initExplosion(bomb.power, bomb.pos);
        this.activeBombs = this.activeBombs.filter((b) => b !== bomb);
        bomb.removeEventListener("onExplosion", this.removeBomb);
    }

    private initExplosion = (power: number, bombPos: IPoint) => {
        const delay = 0.2;
        setTimeout(() => this.explode(bombPos), delay);

        for (let y = 0; y < 2; y++) {
            for (let x = -1; x < 2; x += 2) {
                const direction = {x: x * (1 - y), y: y * x};
                this.addExplosion(bombPos, direction, power, delay);
            }
        }
    }

    private addExplosion(prevPos: IPoint, direction: IPoint, power: number, delay: number) {
        let vDirection = this.validateBounds(prevPos, direction);

        if (!power || vDirection.x + vDirection.y === 0 || this.field[prevPos.y + direction.y][prevPos.x + direction.x] === ECellType.AzovSteel)
            return;

        const pos = {x: prevPos.x + direction.x, y: prevPos.y + direction.y};

        if (this.field[pos.y][pos.x] === ECellType.Wall)
            vDirection = {x: 0, y: 0};

        setTimeout(() => {
            this.explode(pos);
            this.addExplosion(pos, vDirection, power - 1, delay);
        }, delay * 1000);
    }

    private explode(pos: IPoint) {
        const explosion = new ExplosionModel(pos);
        explosion.setExplode(this.removeExplosion);

        this.explosions.push(explosion);
        this.field[pos.y][pos.x] = ECellType.Fire;
    }

    removeExplosion = (explosion: ExplosionModel) => {
        this.explosions = this.explosions.filter((e) => e !== explosion);
        this.field[explosion.pos.y][explosion.pos.x] = ECellType.Empty;
    }

    private validateBounds(pos: IPoint, offset: IPoint) {
        const {x, y} = offset;
        return {
            x: pos.x + x < 0 ? -pos.x : pos.x + x > this.width - 1 ? this.width - 1 - pos.x : x,
            y: pos.y + y < 0 ? -pos.y : pos.y + y > this.height - 1 ? this.height - 1 - pos.y : y,
        };
    }
}