import {FIELD_FILLING} from "../config";
import {Controls, IControlsStates} from "../Controls";
import {EBonusType, ECellType, IPoint, ISceneObject, ISize, TField} from "../types";
import {BombModel} from "./BombModel";
import {PlayerModel} from "./PlayerModel";
import {BonusModel} from "./BonusModel";
import {ExplosionModel} from "./ExplosionModel";

export class GameModel {
    field: TField = [];
    controls = new Controls();
    sceneObjects: ISceneObject[] = [];
    players: PlayerModel[] = [];
    width: number = 0;
    height: number = 0;

    constructor(size: ISize, text: any, private bonuses: EBonusType[]) {
        if (!text) {
            this.width = size.w;
            this.height = size.h;
            this.createPlayer(this.controls.states);
            this.initField();
        } else {
            this.restore(text);
        }
    }

    store() {
        const obj = Object.assign({}, this) as any;
        obj.players = this.players.map(p => p.store());
        obj.sceneObjects = this.sceneObjects.filter((o) => !(o instanceof BombModel))
            .map(o => o.store());

        return obj;
    }

    restore(data: any) {
        this.field = data.field;
        this.width = data.width;
        this.height = data.height;

        data?.players.map((obj: any, i: number) => {
            this.createPlayer(this.controls.states);
            this.players[i].restore(obj);
        });

        data?.sceneObjects.map((obj: any) => {
            switch (obj.type) {
                case "BonusModel":
                    this.addObject(BonusModel.restore(obj, this.field, this.bonuses));
                    break;
                case "ExplosionModel":
                    this.addObject(ExplosionModel.restore(obj, this.field, this.bonuses, this.addObject, this.detonateObject));
                    break;
            }
        });
    }

    createPlayer(states: IControlsStates) {
        const player = new PlayerModel(states, this.field, this.bonuses);
        this.players.push(player);
        player.setPlaceBomb(this.placeBomb);
        player.setGetObject(this.getObject);
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