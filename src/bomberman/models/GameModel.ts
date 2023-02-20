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
                if (y % 2 && x % 2)
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
        const col = Math.round(pos.x);
        const row = Math.round(pos.y);

        if (pos.x + offset.x < 0)
            offset.x = -pos.x;
        if (pos.x + offset.x > this.width - 1)
            offset.x = this.width - 1 - pos.x;
        if (pos.y + offset.y < 0)
            offset.y = -pos.y;
        if (pos.y + offset.y > this.height - 1)
            offset.y = this.height - 1 - pos.y;

        const distanceFromPlayerToCell_X = Math.abs(Math.round(pos.x) - pos.x);
        const distanceFromPlayerToCell_Y = Math.abs(Math.round(pos.y) - pos.y);

        if (distanceFromPlayerToCell_X && distanceFromPlayerToCell_X < Math.abs(offset.x))
            offset.x = distanceFromPlayerToCell_X * Math.sign(offset.x);
        if (distanceFromPlayerToCell_Y && Math.abs(distanceFromPlayerToCell_Y) < Math.abs(offset.y))
            offset.y = distanceFromPlayerToCell_Y * Math.sign(offset.y);

        const newCol = Math.round(pos.x + offset.x + Math.sign(offset.x) / 2);
        const newRow = Math.round(pos.y + offset.y + Math.sign(offset.y) / 2);

        if (newCol > this.width - 1 || newCol < 0 || newRow > this.height - 1 || newRow < 0)
            return {x: offset.x, y: offset.y};

        if (pos.y % 1 === 0 && this.field[row][newCol] === ECellType.Empty)
            validOffset.x = offset.x;
        else if (distanceFromPlayerToCell_X === offset.x && this.field[row][newCol] !== ECellType.Empty)
            validOffset.x = distanceFromPlayerToCell_X;

        if (pos.x % 1 === 0 && this.field[newRow][col] === ECellType.Empty)
            validOffset.y = offset.y;
        else if (distanceFromPlayerToCell_Y === offset.y && this.field[newRow][col] !== ECellType.Empty)
            validOffset.y = distanceFromPlayerToCell_Y;

        if (validOffset.x && validOffset.y)
            validOffset = player.prevAxis === "x" ? {x: 0, y: validOffset.y} : {x: validOffset.x, y: 0};

        return validOffset;
    }

    update(seconds: number) {
        this.players.forEach(p => p.update(seconds));
    }
}