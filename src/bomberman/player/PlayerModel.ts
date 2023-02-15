export class PlayerModel {
    position: { x: number, y: number } = {x: 0, y: 0};
    speed = 100;

    constructor() {
    }

    move = (axis: string, seconds: number, direction: number) => {
        const distance = direction * seconds * this.speed;

        if (axis === "x")
            this.position.x += distance;
        else if (axis === "y")
            this.position.y += distance;
    }
}