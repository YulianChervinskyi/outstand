export interface IKeybControlsStates {
    left: boolean,
    right: boolean,
    forward: boolean,
    backward: boolean,
}

export interface IControlsStates extends IKeybControlsStates {
    pointerLock: boolean,
    movementX: number,
    movementY: number,
}

export class Controls {
    codes = {
        37: 'left',
        39: 'right',
        38: 'forward',
        40: 'backward',
        65: "left",
        68: "right",
        87: "forward",
        83: "backward"
    };

    states: IControlsStates = {
        left: false,
        right: false,
        forward: false,
        backward: false,
        pointerLock: false,
        movementX: 0,
        movementY: 0,
    };

    constructor(private readonly el?: HTMLElement) {
        document.addEventListener('keydown', this.onKey.bind(this, true), false);
        document.addEventListener('keyup', this.onKey.bind(this, false), false);
        document.addEventListener('touchstart', this.onTouch.bind(this), false);
        document.addEventListener('touchmove', this.onTouch.bind(this), false);
        document.addEventListener('touchend', this.onTouchEnd.bind(this), false);
        document.addEventListener("mousemove", this.onMouseMove.bind(this), false);
        el?.addEventListener("click", this.requestPointerLock.bind(this), false);
        document.addEventListener('pointerlockchange', this.onPointerLockChange.bind(this), false);
    }

    onTouch(e: TouchEvent) {
        const t = e.touches[0];
        this.onTouchEnd(e);
        if (t.pageY < window.innerHeight * 0.5) this.onKey(true, {keyCode: 38});
        else if (t.pageX < window.innerWidth * 0.5) this.onKey(true, {keyCode: 37});
        else if (t.pageY > window.innerWidth * 0.5) this.onKey(true, {keyCode: 39});
    }

    onTouchEnd(e: TouchEvent) {
        this.states = {...this.states, left: false, right: false, forward: false, backward: false};
        e.preventDefault();
        e.stopPropagation();
    };

    onMouseMove(e: MouseEvent) {
        if (!this.states.pointerLock)
            return;

        this.states.movementX = e.movementX;
        this.states.movementY = e.movementY;
    }

    onKey(val: boolean, e: { keyCode: number, preventDefault?: () => void, stopPropagation?: () => void }) {
        const state = this.codes[e.keyCode as keyof Controls['codes']] as keyof IKeybControlsStates;
        if (typeof state === 'undefined') return;
        this.states[state] = val;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
    }

    requestPointerLock() {
        this.el?.requestPointerLock();
    }

    onPointerLockChange() {
        this.states.pointerLock = document.pointerLockElement === this.el;
    }
}
