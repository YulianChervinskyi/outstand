export interface IControlsStates {
    left: boolean,
    right: boolean,
    up: boolean,
    down: boolean,
    place: boolean,
}

export class HumanController {
    codes = {
        37: 'left',
        39: 'right',
        38: 'up',
        40: 'down',
        32: 'place',
    };

    states: IControlsStates = {
        left: false,
        right: false,
        up: false,
        down: false,
        place: false,
    };

    constructor() {
        document.addEventListener('keydown', this.onKey.bind(this, true), false);
        document.addEventListener('keyup', this.onKey.bind(this, false), false);
        document.addEventListener('touchstart', this.onTouch.bind(this), false);
        document.addEventListener('touchmove', this.onTouch.bind(this), false);
        document.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    }

    onTouch(e: TouchEvent) {
        const t = e.touches[0];
        this.onTouchEnd(e);
        if (t.pageY < window.innerHeight * 0.5) this.onKey(true, {keyCode: 38});
        else if (t.pageX < window.innerWidth * 0.5) this.onKey(true, {keyCode: 37});
        else if (t.pageY > window.innerWidth * 0.5) this.onKey(true, {keyCode: 39});
    }

    onTouchEnd(e: TouchEvent) {
        this.states = {left: false, right: false, up: false, down: false, place: false};
        e.preventDefault();
        e.stopPropagation();
    };

    onKey(val: boolean, e: { keyCode: number, preventDefault?: () => void, stopPropagation?: () => void }) {
        const state = this.codes[e.keyCode as keyof HumanController['codes']] as keyof HumanController['states'];
        if (typeof state === 'undefined') return;
        this.states[state] = val;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
    }
}

export class ServerController {
    states: IControlsStates = {
        left: false,
        right: false,
        up: false,
        down: false,
        place: false,
    };

    setControls(states: IControlsStates) {
        this.states.left = states.left;
        this.states.right = states.right;
        this.states.up = states.up;
        this.states.down = states.down;
        this.states.place = states.place;
        console.log(JSON.stringify(states));
    }
}
