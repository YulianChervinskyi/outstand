import {BONUS_FILLING, FIELD_FILLING} from "../config";
import {IControlsStates} from "../Controls";
import {ECellType, IPoint, ISceneObject, ISize, TField} from "../types";
import {BombModel} from "./BombModel";
import {PlayerModel} from "./PlayerModel";

export const bonuses: (number | undefined)[] = Object.entries(BONUS_FILLING)
    .reduce((acc,[type, quantity]) => acc.concat(Array(quantity).fill(+type)), [] as (number | undefined)[]);

console.log(bonuses);

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
        player.setPlaceBomb(this.placeBomb);
        player.setGetObject(this.getObject);
        return player;
    }

    placeBomb = (bomb: BombModel) => {
        bomb.setListeners(this.addObject, this.detonateObject);
        this.addObject(bomb);
    }

    update(seconds: number) {
        this.players.forEach(p => p.update(seconds));

        for (const o of this.sceneObjects) {
            if (!o.update(seconds))
                this.removeObject(o);
        }
    }

    getObject = (pos: IPoint) => {
        return this.sceneObjects.find(o => o.pos.x === pos.x && o.pos.y === pos.y);
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

    private addObject = (o: ISceneObject) => {
        this.sceneObjects.push(o);
    }

    private removeObject = (object: ISceneObject) => {
        this.sceneObjects = this.sceneObjects.filter((o) => o !== object);
        this.field[object.pos.y][object.pos.x] = ECellType.Empty;

        if (object.generatedObject)
            this.sceneObjects.push(object.generatedObject);
    }

    private detonateObject = (pos: IPoint) => {
        this.sceneObjects.find(o => o.pos.x === pos.x && o.pos.y === pos.y)?.detonate();
    }
}