import {ECellType, ISize} from "./types";
import {PlayerModel} from "./player/PlayerModel";

export class GameModel {
    player = new PlayerModel();

    width: number = 0;
    height: number = 0;
    field: ECellType[][] = [];

    constructor(size: ISize) {
        this.width = size.w;
        this.height = size.h;
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
                    this.field[y][x] = Math.random() < 0.3 ? ECellType.Wall : ECellType.Empty;
            }
        }
    }

    playerOffsetCheck(offsetX: number, offsetY: number) {
        let validOffset = {x: 0, y: 0};
        const p = this.player.position;

        if (p.x + offsetX < 0)
            offsetX = -p.x;
        if (p.x + offsetX > this.width - 1)
            offsetX = this.width - 1 - p.x;
        if (p.y + offsetY < 0)
            offsetY = -p.y;
        if (p.y + offsetY > this.height - 1)
            offsetY = this.height - 1 - p.y;

        const col = Math.round(this.player.position.x);
        const row = Math.round(this.player.position.y);
        const newCol = Math.round(this.player.position.x + offsetX);
        const newRow = Math.round(this.player.position.y + offsetY);
        console.log(newCol, newRow);

        if (this.field[row][newCol] === ECellType.Empty)
            validOffset.x = offsetX;

        if (this.field[newRow][col] === ECellType.Empty)
            validOffset.y = offsetY;

        return validOffset;
    }
}