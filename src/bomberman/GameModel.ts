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
                this.field[y][x] = Math.floor(Math.random() * (Math.floor(7) - Math.ceil(0) + 1) + Math.ceil(0));
            }
        }
    }
}