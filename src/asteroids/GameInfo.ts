import {Game} from "./Game";

export class GameInfo {
    private readonly ctx = this.canvas.getContext('2d')!;

    constructor(private readonly canvas: HTMLCanvasElement, private readonly game: Game) {

    }

    render() {
        this.ctx.save();
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(`Lives: ${this.game.lives}`, 10, 20);
        this.ctx.fillText(`Level: ${this.game.level}`, 10, 40);
        this.ctx.fillText(`Score: ${this.game.score}`, 10, 60);
        this.ctx.restore();
    }
}