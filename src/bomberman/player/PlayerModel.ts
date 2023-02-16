import {CELL_SIZE} from "../config";

export class PlayerModel {
    position = {row: 0, col: 0};
    speed = 100;

    constructor() {
    }

    walk = (offsetX: number, offsetY: number) => {
        // const diagonalCoef = offsetX && offsetY ? this.speed / Math.sqrt(Math.pow(this.speed, 2) * 2) : 1;

        this.position.row += (offsetX * this.speed /** diagonalCoef*/) / CELL_SIZE;
        this.position.col += (offsetY * this.speed /** diagonalCoef*/) / CELL_SIZE;
    }
}