export interface IPoint {
    x: number,
    y: number,
}

export interface IRectangle {
    a: IPoint,
    b: IPoint,
    c: IPoint,
    d: IPoint,
}

export interface ICircle {
    p: IPoint,
    r: number,
}

export interface ILine {
    a: IPoint,
    b: IPoint,
}

export function circleIntersectRectangle(c: ICircle, r: IRectangle) {
    return pointInRectangle(c.p, r) ||
        lineIntersectCircle(c, {a: r.a, b: r.b}) ||
        lineIntersectCircle(c, {a: r.b, b: r.c}) ||
        lineIntersectCircle(c, {a: r.c, b: r.d}) ||
        lineIntersectCircle(c, {a: r.d, b: r.a});
}

export function pointInRectangle(p: IPoint, r: IRectangle) {
    // 0 ≤ AP·AB ≤ AB·AB and 0 ≤ AP·AD ≤ AD·AD
    const ap_x = r.a.x - p.x;
    const ap_y = r.a.y - p.y;
    const ab_x = r.a.x - r.b.x;
    const ab_y = r.a.y - r.b.y;
    const ad_x = r.a.x - r.d.x;
    const ad_y = r.a.y - r.d.y;

    const ap_ab = ap_x * ab_x + ap_y * ab_y;
    const ab_ab = ab_x ** 2 + ab_y ** 2;
    const ap_ad = ap_x * ad_x + ap_y * ad_y
    const ad_ad = ad_x ** 2 + ad_y ** 2;

    return ap_ab >= 0 && ap_ab <= ab_ab && ap_ad >= 0 && ap_ad <= ad_ad;
}

export function lineIntersectCircle(c: ICircle, l: ILine) {
    return distanceSegmentToPoint(c.p, l) <= c.r;
}

export function distanceSegmentToPoint(c: IPoint, l: ILine) {
    const ac = Vector.sub(c, l.a);
    const ab = Vector.sub(l.b, l.a);
    const d = Vector.add(Vector.proj(ac, ab), l.a);
    const ad = Vector.sub(d, l.a);

    const k = Math.abs(ab.x) > Math.abs(ab.y) ? ad.x / ab.x : ad.y / ab.y;

    if (k <= 0.0) {
        return Math.sqrt(Vector.hypot2(c, l.a));
    } else if (k >= 1.0) {
        return Math.sqrt(Vector.hypot2(c, l.b));
    }

    return Math.sqrt(Vector.hypot2(c, d));
}

// With that insight, something like the following will work, where the circle has centre P and radius R,
// and the rectangle has vertices A, B, C, D in that order (not complete code):
//
// def intersect(Circle(P, R), Rectangle(A, B, C, D)):
// S = Circle(P, R)
// return (pointInRectangle(P, Rectangle(A, B, C, D)) or
// intersectCircle(S, (A, B)) or
// intersectCircle(S, (B, C)) or
// intersectCircle(S, (C, D)) or
// intersectCircle(S, (D, A)))
// If you're writing any geometry you probably have the above functions in your library already.
// Otherwise, pointInRectangle() can be implemented in several ways; any of the general point
// in polygon methods will work, but for a rectangle you can just check whether this works:
//
// 0 ≤ AP·AB ≤ AB·AB and 0 ≤ AP·AD ≤ AD·AD
// And intersectCircle() is easy to implement too: one way would be to check if the foot of the perpendicular
// from P to the line is close enough and between the endpoints, and check the endpoints otherwise.
//
// The cool thing is that the same idea works not just for rectangles but for the intersection of a circle
// with any simple polygon — doesn't even have to be convex!

export class Vector {
    static add(a: IPoint, b: IPoint): IPoint {
        return {x: a.x + b.x, y: a.y + b.y};
    }

    static sub(a: IPoint, b: IPoint): IPoint {
        return {x: a.x - b.x, y: a.y - b.y};
    }

    static dot(a: IPoint, b: IPoint): number {
        return a.x * b.x + a.y * b.y;
    }

    static hypot2(a: IPoint, b: IPoint) {
        return this.dot(this.sub(a, b), this.sub(a, b));
    }

    static proj(a: IPoint, b: IPoint): IPoint {
        const factor = Vector.dot(a, b) / Vector.dot(b, b);
        return {x: b.x * factor, y: b.y * factor};
    }
}