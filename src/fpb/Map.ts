export interface IOrigin {
    x: number,
    y: number,
    distance: number,
    wall: number,
}

export interface IStep {
    length2: number,
    dx: number,
    dy: number,
    byX: boolean,
}

export interface IWall {
    color: string,
}

export class Map {
    walls: IWall[] = [
        {color: '#ff0000'},
        {color: '#00ff00'},
        {color: '#0000ff'},
        {color: '#ffff00'},
        {color: '#ff00ff'},
        {color: '#00ffff'},
        {color: '#ffffff'},
    ];

    wallGrid = new Uint8Array(this.size * this.size);

    constructor(public size: number, data?: number[]) {
        if (data && data.length === size * size) {
            this.wallGrid.set(data);
        } else {
            this.randomize();
        }
    }

    randomize() {
        for (let i = 0; i < this.wallGrid.length; i++) {
            this.wallGrid[i] = Math.random() < 0.3 ? Math.floor(Math.random() * this.walls.length) : 255;
        }
    }

    get(x: number, y: number) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return 255;
        return this.wallGrid[y * this.size + x];
    }

    cast(point: { x: number, y: number }, angle: number, range: number): IOrigin {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        let distance = 0;
        let x = point.x;
        let y = point.y;
        let wall = 0;
        while (distance < range) {
            const step = this.step(sin, cos, x, y);
            distance += Math.sqrt(step.length2);
            x += step.dx;
            y += step.dy;
            wall = this.get(step.byX && step.dx < 0 ? x - 1 : x, !step.byX && step.dy < 0 ? y - 1 : y);
            if (wall < 255)
                break;
        }

        return {x, y, distance: distance, wall};
    }

    step(sin: number, cos: number, x: number, y: number): IStep {
        const stepX = this.stepX(sin, cos, x);
        const stepY = this.stepY(sin, cos, y);
        return stepX.length2 < stepY.length2 ? stepX : stepY;
    }

    stepX(sin: number, cos: number, x: number): IStep {
        if (cos === 0)
            return {length2: Infinity, dx: NaN, dy: NaN, byX: true};

        const dx = cos > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
        const dy = dx * sin / cos;
        return {
            dx,
            dy,
            length2: dx * dx + dy * dy,
            byX: true,
        }
    }

    stepY(sin: number, cos: number, y: number): IStep {
        if (sin === 0)
            return {length2: Infinity, dx: NaN, dy: NaN, byX: false};

        const dy = sin > 0 ? Math.floor(y + 1) - y : Math.ceil(y - 1) - y;
        const dx = dy * cos / sin;
        return {
            dx,
            dy,
            length2: dx * dx + dy * dy,
            byX: false,
        }
    }

}