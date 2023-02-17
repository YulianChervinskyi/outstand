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
                    this.field[y][x] = Math.random() < 0.1 ? ECellType.Wall : ECellType.Empty;
            }
        }
    }

    playerOffsetCheck(offsetX: number, offsetY: number) {
        let validOffset = {x: 0, y: 0};
        const pos = this.player.position;

        if (pos.x + offsetX < 0)
            offsetX = -pos.x;
        if (pos.x + offsetX > this.width - 1)
            offsetX = this.width - 1 - pos.x;
        if (pos.y + offsetY < 0)
            offsetY = -pos.y;
        if (pos.y + offsetY > this.height - 1)
            offsetY = this.height - 1 - pos.y;

        const col = Math.round(pos.x);
        const row = Math.round(pos.y);
        const newCol = Math.round(pos.x + offsetX + Math.sign(offsetX) / 2);
        const newRow = Math.round(pos.y + offsetY + Math.sign(offsetY) / 2);

        console.log(`pos: ${pos.x}, ${pos.y}`)
        console.log(`nPos: ${newCol}, ${newRow}`);

        if (pos.y % 1 === 0 && this.field[row][newCol] === ECellType.Empty)
            validOffset.x = offsetX;

        if (pos.x % 1 === 0 && this.field[newRow][col] === ECellType.Empty)
            validOffset.y = offsetY;

        return validOffset;
    }
}