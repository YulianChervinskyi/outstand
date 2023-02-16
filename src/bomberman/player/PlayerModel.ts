export class PlayerModel {
    position = {row: 0, col: 0};
    speed = 1.6;

    constructor() {
    }

    walk = (offsetX: number, offsetY: number) => {
        this.position.row += offsetX;
        this.position.col += offsetY;
    }
}