import {ECellType, IPoint, ISize} from "../types";
import {PlayerModel} from "./PlayerModel";

export class GameModel {
    field: ECellType[][] = [];
    players: PlayerModel[];
    width: number = 0;
    height: number = 0;

    constructor(size: ISize, players: PlayerModel[]) {
        this.width = size.w;
        this.height = size.h;
        this.players = players;
        this.players.forEach(player => player.setCheckOffset(this.fixPlayerOffset.bind(this)));
        this.initField();
    }

    private initField() {
        for (let y = 0; y < this.height; y++) {
            this.field.push([]);
            for (let x = 0; x < this.width; x++) {
                if (y % 2 && x % 2 && x + y > 2)
                    this.field[y][x] = ECellType.AzovSteel;
                else if ((x + y <= 2) || (x + y) >= (this.height + this.width - 3))
                    this.field[y][x] = ECellType.Empty;
                else
                    this.field[y][x] = Math.random() < 0.1 ? ECellType.Wall : ECellType.Empty;
            }
        }
    }

    private fixPlayerOffset(p: IPoint, offset: IPoint) {
        const initialOffset = {x: offset.x, y: offset.y};
        let validOffset = {x: 0, y: 0};
        const pos = {x: p.x, y: p.y};

        this.fixBounds(pos, offset);

        let totalWay = Math.abs(offset.x) + Math.abs(offset.y);

        let count = 0;
        while (totalWay > 0) {
            const oldTotalWay = totalWay;

            const calcDx = () => Math.round(pos.x) - pos.x;
            const calcDy = () => Math.round(pos.y) - pos.y;

            const isRowFree = (pos: IPoint, xOffset: number) => {
                const row1 = Math.round(pos.y);
                const row2 = row1 - Math.sign(calcDy());
                const col = Math.round(pos.x + xOffset + Math.sign(xOffset) / 2);
                return !this.isCellOccupied(col, row1) && !this.isCellOccupied(col, row2);
            }

            const isColFree = (pos: IPoint, yOffset: number) => {
                const col1 = Math.round(pos.x);
                const col2 = col1 - Math.sign(calcDx());
                const row = Math.round(pos.y + yOffset + Math.sign(yOffset) / 2);
                return !this.isCellOccupied(col1, row) && !this.isCellOccupied(col2, row);
            }

            if (offset.x) {
                const dx = calcDx();
                const dy = calcDy();
                if (dx) {
                    const absDx = Math.abs(dx);
                    const gridDx = Math.min(Math.sign(offset.x) === Math.sign(dx) ? absDx : 1 - absDx, Math.abs(offset.x)) * Math.sign(offset.x);
                    validOffset.x += gridDx;
                    totalWay -= Math.abs(gridDx);
                    pos.x += gridDx;
                    offset.x -= gridDx;
                } else if (isRowFree(pos, offset.x)) {
                    validOffset.x += offset.x;
                    totalWay -= Math.abs(offset.x);
                    pos.x += offset.x;
                    offset.x = 0;
                } else if (!initialOffset.y && !this.isCellOccupied(pos.x + Math.sign(offset.x), Math.round(pos.y))) {
                    const absDx = Math.min(Math.abs(offset.x), Math.abs(dy));
                    offset.y += absDx * Math.sign(dy);
                    offset.x -= absDx * Math.sign(offset.x);
                }
            }

            if (offset.y) {
                const dx = calcDx();
                const dy = calcDy();
                if (dy) {
                    const absDy = Math.abs(dy);
                    const gridDy = Math.min(Math.sign(offset.y) === Math.sign(dy) ? absDy : 1 - absDy, Math.abs(offset.y)) * Math.sign(offset.y);
                    validOffset.y += gridDy;
                    totalWay -= Math.abs(gridDy);
                    pos.y += gridDy;
                    offset.y -= gridDy;
                } else if (isColFree(pos, offset.y)) {
                    validOffset.y += offset.y;
                    totalWay -= Math.abs(offset.y);
                    pos.y += offset.y;
                    offset.y = 0;
                } else if (!initialOffset.x && !this.isCellOccupied(Math.round(pos.x), pos.y + Math.sign(offset.y))) {
                    const absDy = Math.min(Math.abs(offset.y), Math.abs(dx));
                    offset.x += absDy * Math.sign(dx);
                    offset.y -= absDy * Math.sign(offset.y);
                }
            }
            count++;

            if (count % 4 === 0 && oldTotalWay === totalWay)
                break;
        }
        console.log("count:", count);
        return validOffset;
    }

    update(seconds: number) {
        this.players.forEach(p => p.update(seconds));
    }

    fixBounds(pos: IPoint, offset: IPoint) {
        if (pos.x + offset.x < 0)
            offset.x = -pos.x;
        if (pos.x + offset.x > this.width - 1)
            offset.x = this.width - 1 - pos.x;
        if (pos.y + offset.y < 0)
            offset.y = -pos.y;
        if (pos.y + offset.y > this.height - 1)
            offset.y = this.height - 1 - pos.y;
    }

    isCellOccupied(col: number, row: number) {
        return this.field[row]?.[col] !== ECellType.Empty;
    }

}