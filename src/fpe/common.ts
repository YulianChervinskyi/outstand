export const CIRCLE = Math.PI * 2;

export class Bitmap {
    image = new Image();

    constructor(src: string, readonly width: number, readonly height: number) {
        this.image.src = src;
    }
}
