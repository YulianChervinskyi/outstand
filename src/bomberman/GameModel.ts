import {ECellType, ISize} from "./types";

export class GameModel {
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
}