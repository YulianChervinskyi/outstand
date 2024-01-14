export class GameLoop {
    lastTime = 0;
    callback?: (seconds: number) => void;

    constructor() {
        this.frame = this.frame.bind(this);
    }

    start(callback: (seconds: number) => void) {
        this.callback = callback;
        requestAnimationFrame(this.frame);
    };

    stop() {
        this.callback = undefined;
    }

    frame(time: number) {
        if (!this.callback)
            return;

        const seconds = (time - this.lastTime) / 1000;
        this.lastTime = time;
        if (seconds < 0.2) this.callback(seconds);
        requestAnimationFrame(this.frame);
    }
}
