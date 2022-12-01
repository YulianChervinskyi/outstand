import {EObjectType, IBody, IPoint, ISceneObject, IShapeData} from "../types";


export interface ISceneObjectParams {
    x?: number,
    y?: number,
    angle?: number,
    ttl?: number,
}

export class SceneObject implements ISceneObject {
    type: EObjectType;
    body: IBody;
    x: number;
    y: number;
    angle: number;
    ttl: number;
    shapeData: IShapeData = {points: [], max: {x: 0, y: 0}, min: {x: 0, y: 0}};
    generatedObjects: SceneObject[] = [];

    constructor(type: EObjectType, body: IBody, p: ISceneObjectParams = {}) {
        this.type = type;
        this.body = body;
        this.x = p.x || 0;
        this.y = p.y || 0;
        this.angle = p.angle || 0;
        this.ttl = p.ttl || Infinity;
    }

    position(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    rotate(value: number) {
        this.angle += value;
    }

    update(seconds: number) {
        const ox = this.x;
        const oy = this.y;
        const s = Math.sin(this.angle);
        const c = Math.cos(this.angle);

        const points: IPoint[] = [];
        let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];

        this.body.points.forEach((p) => {
            const x = ox + (p.x * c + p.y * s);
            const y = oy + (p.x * s - p.y * c);
            points.push({x, y});
            [minX, minY, maxX, maxY] = [Math.min(minX, x), Math.min(minY, y), Math.max(maxX, x), Math.max(maxY, y)];
        });

        this.shapeData.points = points;
        this.shapeData.min = {x: minX, y: minY};
        this.shapeData.max = {x: maxX, y: maxY};

        const generatedObjects = this.generatedObjects;
        this.generatedObjects = [];

        return generatedObjects;
    }

    checkCollision(object: ISceneObject) {
        const aPoints = this.shapeData.points;
        const bPoints = object.shapeData.points;

        let a2 = aPoints[aPoints.length - 1];
        for (let i = 0; i < aPoints.length; i++) {
            let a1 = aPoints[i];

            let b2 = bPoints[bPoints.length - 1];
            for (let j = 0; j < bPoints.length; j++) {
                let b1 = bPoints[j];

                if (findLineIntersection(a1, a2, b1, b2)) {
                    return true;
                }
                b2 = b1;
            }
            a2 = a1;
        }
        return false;
    }
}

// function linesIntersect(a1: IPoint, a2: IPoint, b1: IPoint, b2: IPoint) {
//     const A1 = (a1.y - a2.y) / (a1.x - a2.x)  // Pay attention to not dividing by zero
//     const A2 = (b1.y - b2.y) / (b1.x - b2.x)  // Pay attention to not dividing by zero
//
//     if (Math.max(a1.x, a2.x) < Math.max(b1.x, b2.x))
//         return false
//
//     if (A1 === A2)
//         return false; // parallel lines
//
//     const B1 = a1.y - A1 * a1.x;
//     const B2 = b1.y - A2 * b1.x;
//
//     const Xa = (B2 - B1) / (A1 - A2);
//
//     return !((Xa < Math.max(Math.min(a1.x, a2.x), Math.min(b1.x, b2.x))) ||
//         (Xa > Math.min(Math.max(a1.x, a2.x), Math.max(b1.x, b2.x))));
// }

function findLineIntersection(pa1: IPoint, pa2: IPoint, pb1: IPoint, pb2: IPoint) {
    const s1_x = pa2.x - pa1.x;
    const s1_y = pa2.y - pa1.y;
    const s2_x = pb2.x - pb1.x;
    const s2_y = pb2.y - pb1.y;

    const s = (-s1_y * (pa1.x - pb1.x) + s1_x * (pa1.y - pb1.y)) / (-s2_x * s1_y + s1_x * s2_y);
    const t = (s2_x * (pa1.y - pb1.y) - s2_y * (pa1.x - pb1.x)) / (-s2_x * s1_y + s1_x * s2_y);

    return s >= 0 && s <= 1 && t >= 0 && t <= 1;

    // if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    //     var intersectionX = pa1.x + (t * s1_x);
    //     var intersectionY = pa1.y + (t * s1_y);
    //     return {x: intersectionX, y: intersectionY};
    // }
    //
    // return false;
}
