import {FIELD_FILLING} from "../config";
import {IControlsStates} from "../Controls";
import {EBonusType, ECellType, IFullPlayerState, IPoint, ISceneObject, ISize, TField} from "../types";
import {BombModel} from "./BombModel";
import {PlayerModel} from "./PlayerModel";
import {BonusModel} from "./BonusModel";
import {ExplosionModel} from "./ExplosionModel";
import {IModelState} from "../services/AIService";

const NO_MOTION_LIMIT = 400;

export class GameModel {
    field: TField = [];
    sceneObjects: ISceneObject[] = [];
    players: PlayerModel[] = [];
    width: number = 0;
    height: number = 0;
    playerPlaces: IPoint[] = [];

    constructor(size: ISize, text: any, private bonuses: EBonusType[], private controlStates: IControlsStates[]) {
        if (!text) {
            this.width = size.w;
            this.height = size.h;
            this.createPlayerPlaces();
            for (const controlState of controlStates) {
                this.createPlayer(controlState);
            }
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
        this.createPlayerPlaces();

        data?.players.forEach((obj: any, i: number) => {
            if (i < this.controlStates.length) {
                this.createPlayer(this.controlStates[i]);
                this.players[i].restore(obj);
            }
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
        const pos = this.playerPlaces.shift();
        if (!pos)
            throw new Error("No more player places");

        const player = new PlayerModel(pos, states, this.field, this.bonuses);
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

    playerStates: IFullPlayerState[] = [];
    playerScores: number[] = [];
    playerPositions: IPoint[] = [];
    noMotionCounter = 0;

    getModelStateByPlayer(playerId: number): IModelState {
        const player = this.players[playerId];
        const x = Math.round(player.pos.x);
        const y = Math.round(player.pos.y);

        this.noMotionCounter = this.playerPositions[playerId]?.x === x && this.playerPositions[playerId]?.y === y
            ? this.noMotionCounter + 1
            : 0;

        // console.log("noMotionCounter:", this.noMotionCounter);

        const state = player.state;
        const prevState = this.playerStates[playerId] || state;
        this.playerStates[playerId] = state;

        const bombPlaced = state.currSupply < prevState.currSupply;
        const playerDied = state.life < prevState.life || this.noMotionCounter > NO_MOTION_LIMIT;

        let reward = (bombPlaced ? 1 : 0) + (playerDied ? -10 : 0);
        let score = this.playerScores[playerId] || 0;

        if (bombPlaced) {
            const lastBomb = player.bombs.at(-1);
            if (lastBomb) {
                const {x, y} = lastBomb.pos;
                Object.values(this.getCellsAround(x, y)).forEach((cell) => {
                    if (cell === ECellType.Wall) {
                        reward += 5;
                        score += 1;
                    }
                });
            }
        }
        // console.log("reward:", reward);
        this.playerScores[playerId] = score;
        this.playerPositions[playerId] = {x, y};

        const around = this.getCellsAround(x, y);
        return {
            state: {
                x: player.pos.x / (this.width - 1),
                y: player.pos.y / (this.height - 1),
                bombs: player.state.currSupply / player.state.maxSupply,
                left: around.left / 5,
                right: around.right / 5,
                up: around.up / 5,
                down: around.down / 5,
                center: this.field[y][x] / 5,
                dangerLeft: this.computeDanger(x, y, {x: -1, y: 0}),
                dangerRight: this.computeDanger(x, y, {x: 1, y: 0}),
                dangerUp: this.computeDanger(x, y, {x: 0, y: -1}),
                dangerDown: this.computeDanger(x, y, {x: 0, y: 1}),
            },
            reward,
            done: playerDied,
            score,
        };
    }

    private getCellsAround(x: number, y: number) {
        return {
            left: x - 1 >= 0 ? this.field[y][x - 1] : ECellType.AzovSteel,
            right: x + 1 < this.width ? this.field[y][x + 1] : ECellType.AzovSteel,
            up: y - 1 >= 0 ? this.field[y - 1][x] : ECellType.AzovSteel,
            down: y + 1 < this.height ? this.field[y + 1][x] : ECellType.AzovSteel,
        }
    }

    private computeDanger(x: number, y: number, dir: IPoint): number {
        const cell: IPoint = {x: x + dir.x, y: y + dir.y};

        const checkDistance = (start: IPoint, end: IPoint, minDistance: number): number => {
            const distanceX = end.x === start.x ? 0 : Math.abs(end.x - start.x);
            const distanceY = end.y === start.y ? 0 : Math.abs(end.y - start.y);

            return distanceY > minDistance || distanceX > minDistance ? 0 : 1;
        }

        while ((cell.x >= 0 && cell.x < this.width) && (cell.y >= 0 && cell.y < this.height)) {

            if (this.field[cell.y][cell.x] === ECellType.Bomb) {
                return checkDistance({x: x, y: y}, cell, (this.getObject(cell) as BombModel).power);
            } else if (this.field[cell.y][cell.x] === ECellType.Explosion) {
                const explDir = (this.getObject(cell) as ExplosionModel).direction;

                // check if the explosion's direction is opposite to checked direction
                if (explDir && dir.x + explDir.x + dir.y + explDir.y)
                    return checkDistance({x: x, y: y}, cell, (this.getObject(cell) as ExplosionModel)._power);
            }

            cell.x += dir.x;
            cell.y += dir.y;
        }

        return 0;
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

    private createPlayerPlaces() {
        this.playerPlaces = [
            {x: 0, y: 0},
            {x: this.width - 1, y: this.height - 1},
            {x: this.width - 1, y: 0},
            {x: 0, y: this.height - 1},
        ];
    }
}