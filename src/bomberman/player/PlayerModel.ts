export class PlayerModel {
    position: { x: number, y: number } = {x: 0, y: 0};
    speed = 100;

    constructor() {
    }

    walk = (offsetX: number, offsetY: number) => {
        const diagonalCoef = offsetX && offsetY ? this.speed / Math.sqrt(Math.pow(this.speed, 2) * 2) : 1;

        this.position.x += offsetX * this.speed * diagonalCoef;
        this.position.y += offsetY * this.speed * diagonalCoef;
    }
}