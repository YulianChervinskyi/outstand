import {ECellType, ISize} from "../types";
import {PlayerModel} from "./PlayerModel";

export class GameModel {
    field: ECellType[][] = [];
    players: PlayerModel[];
    width: number = 0;
    height: number = 0;

    constructor(size: ISize, players: PlayerModel[]) {
        this.width = size.w;
        this.height = size.h;
        this.players = players;
        this.players.forEach(player => player.setCheckOffset(this.checkPlayerOffset.bind(this, player)));
        this.initField();
    }

    private initField() {
        for (let y = 0; y < this.height; y++) {
            this.field.push([]);
            for (let x = 0; x < this.width; x++) {
                if (y % 2 && x % 2 && (x > 1 || y > 1))
                    this.field[y][x] = ECellType.AzovSteel;
                else if ((x + y <= 1) || (x + y) >= (this.height + this.width - 3))
                    this.field[y][x] = ECellType.Empty;
                else
                    this.field[y][x] = Math.random() < 0.1 ? ECellType.Wall : ECellType.Empty;
            }
        }
    }

    checkPlayerOffset(player: PlayerModel, offset: { x: number, y: number }) {
        let validOffset = {x: 0, y: 0};
        const pos = player.pos;

        if (pos.x + offset.x < 0)
            offset.x = -pos.x;
        if (pos.x + offset.x > this.width - 1)
            offset.x = this.width - 1 - pos.x;
        if (pos.y + offset.y < 0)
            offset.y = -pos.y;
        if (pos.y + offset.y > this.height - 1)
            offset.y = this.height - 1 - pos.y;

        const col = Math.round(pos.x);
        const row = Math.round(pos.y);
        const newCol = Math.round(pos.x + offset.x + Math.sign(offset.x) / 2);
        const newRow = Math.round(pos.y + offset.y + Math.sign(offset.y) / 2);

        if (newCol > this.width - 1 || newCol < 0 || newRow > this.height - 1 || newRow < 0)
            return {x: offset.x, y: offset.y};

        const xDeviation = pos.x - Math.round(pos.x);
        const yDeviation = pos.y - Math.round(pos.y);

        const validateX = () => {
            if (offset.x && Math.abs(yDeviation) < 0.2 && this.field[row][newCol] === ECellType.Empty) {
                validOffset.x = offset.x;
                validOffset.y = -yDeviation;
            } else if (offset.x && this.field[row][newCol] !== ECellType.Empty) {
                validOffset.x = Math.round(pos.x) - pos.x;
            }
        }

        const validateY = () => {
            if (offset.y && Math.abs(xDeviation) < 0.2 && this.field[newRow][col] === ECellType.Empty) {
                validOffset.y = offset.y;
                validOffset.x = -xDeviation;
            } else if (offset.y && this.field[newRow][col] !== ECellType.Empty) {
                validOffset.y = Math.round(pos.y) - pos.y;
            }
        }

        if (player.direction === "x") {
            validateX();
            validateY();
        } else {
            validateY();
            validateX();
        }

        return validOffset;
    }

    update(seconds: number) {
        this.players.forEach(p => p.update(seconds));
    }
}