import {IShape} from "./config";

export interface IPiece {
    x: number;
    y: number;
    rotation: number;
    shape: IShape;
}

export class PieceModel {

    constructor(readonly piece: IPiece) {}

    get color() { return this.piece.shape.color};

    get x() { return this.piece.x}

    get y() { return this.piece.y}

    get shape() {
        const shape: number[][] = [];
        const swap = this.piece.rotation % 2;
        const body = this.piece.shape.body;
        const h = body.length;
        const w = body[0].length;

        for (let y = 0; y < (swap ? w : h); y++) {
            shape.push([]);
            for (let x = 0; x < (swap ? h : w); x++) {
                switch (this.piece.rotation) {
                    case 0:
                        shape[y][x] = body[y][x];
                        break;
                    case 1:
                        shape[y][x] = body[h - x - 1][y];
                        break;
                    case 2:
                        shape[y][x] = body[h - y - 1][w - x - 1];
                        break;
                    case 3:
                        shape[y][x] = body[x][w - y - 1];
                        break;
                }
            }
        }
        return shape;
    }
}
