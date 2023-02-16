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
                    this.field[y][x] = Math.random() < 0.7 ? ECellType.Wall : ECellType.Empty;
            }
        }
    }

    playerOffsetCheck(offsetX: number, offsetY: number): { x: number, y: number } {
        let validOffset = { x: 0, y: 0 };

        const playerPosRow = offsetX !== 0
            ? this.player.position.row + Math.round(100 * offsetX / 2)
            : this.player.position.row;

        const playerPosCol = offsetY !== 0
            ? this.player.position.col + Math.round(100 * offsetY / 2)
            : this.player.position.col;

        if (playerPosRow >= 0 && playerPosRow < this.width && this.field[playerPosCol][playerPosRow] === ECellType.Empty)
            validOffset.x = offsetX;

        if (playerPosCol >= 0 && playerPosCol < this.height && this.field[playerPosCol][playerPosRow] === ECellType.Empty)
            validOffset.y = offsetY;

        return validOffset;
    }
}