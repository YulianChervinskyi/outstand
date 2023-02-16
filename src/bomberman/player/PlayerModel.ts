export class PlayerModel {
    position = {x: 0, y: 0};
    speed = 5;

    constructor() {
    }

    walk = (offsetX: number, offsetY: number) => {
        this.position.x += offsetX;
        this.position.y += offsetY;
    }
}