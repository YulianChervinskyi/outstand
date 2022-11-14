import {IPiece} from "./config";

export class PieceModel {
    x: number;
    y: number;
    rotation: number;
    piece: IPiece;

    constructor(props: { piece: IPiece, x?: number, y?: number, rotation?: number }) {
        this.x = props.x || 0;
        this.y = props.y || 0;
        this.rotation = props.rotation || 0;
        this.piece = props.piece;
    }

    get color() { return this.piece.color};

    get shape() {
        const shape: number[][] = [];
        const swap = this.rotation % 2;
        const h = this.piece.shape.length;
        const w = this.piece.shape[0].length;

        for (let y = 0; y < (swap ? w : h); y++) {
            shape.push([]);
            for (let x = 0; x < (swap ? h : w); x++) {
                switch (this.rotation) {
                    case 0:
                        shape[y][x] = this.piece.shape[y][x];
                        break;
                    case 1:
                        shape[y][x] = this.piece.shape[h - x - 1][y];
                        break;
                    case 2:
                        shape[y][x] = this.piece.shape[h - y - 1][w - x - 1];
                        break;
                    case 3:
                        shape[y][x] = this.piece.shape[x][w - y - 1];
                        break;
                }
            }
        }
        return shape;
    }
}
