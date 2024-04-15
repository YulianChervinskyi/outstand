import React from "react";
import {IComponentProps} from "../Box";
import {Controls} from "../Controls";
import {Scene} from "./Scene";
import {ISceneData} from "./types";

interface IState {
    data?: ISceneData;
    paused: boolean;
    showGeometry: boolean;
}

const initialState: IState = {
    paused: false,
    showGeometry: true,
}

export class Drive extends React.Component<IComponentProps, IState> {

    private readonly canvasRef = React.createRef<HTMLCanvasElement>();
    private pointerLock = false;
    private _controls: Controls | undefined;
    private _scene: Scene | undefined;
    private lastTime: DOMHighResTimeStamp = 0;

    constructor(props: IComponentProps) {
        super(props);
        this.state = this.props.text ? JSON.parse(this.props.text) : initialState;
        this.props.onChangeGeometry({minSize: {w: 320, h: 240}, aspectRatio: {w: 4, h: 3}});
    }

    get controls() {
        if (!this._controls)
            throw new Error("component did not mount");

        return this._controls;
    }

    get scene() {
        if (!this._scene)
            throw new Error("component did not mount");

        return this._scene;
    }

    componentDidMount() {
        const canvas = this.canvasRef.current;
        if (!canvas)
            throw new Error("component did not mount");

        document.addEventListener("keydown", this.handleKeyDown);

        this._controls = new Controls();
        this._scene = new Scene(canvas, this.state.data);
        this.scene.update(this.controls.states, 0, this.state);
        requestAnimationFrame(this.tick);
    }

    private tick = (time: DOMHighResTimeStamp) => {
        this.update((time - this.lastTime) / 1000);
        this.lastTime = time;
        requestAnimationFrame(this.tick);
    }

    private update(seconds: number) {
        if (!this.props.active || this.state.paused)
            return;

        if (seconds > 0 && seconds < 0.2) {
            this.scene.update(this.controls.states, seconds, this.state);
            this.setState({data: this.scene.data});
        }

        if (this.pointerLock && !this.controls.states.pointerLock) {
            this.setState({paused: true});
        }

        this.pointerLock = this.controls.states.pointerLock;
    }

    private continueGame = () => {
        this.setState({paused: false});
        this.controls.requestPointerLock();
    }

    private resetGame = () => {
        this.setState(initialState);
        this._scene = new Scene(this.canvasRef.current!, initialState.data);
        this.controls.requestPointerLock();
    }

    render() {
        return <div className="drive">
            {this.state.paused && <div className="info-overlay">
                Paused
                <div className="controls">
                    <button onClick={this.continueGame}>Continue</button>
                    <button onClick={this.resetGame}>Restart</button>
                </div>
            </div>}

            <canvas width={1024} height={768} ref={this.canvasRef} style={{width: "100%", height: "100%"}}/>
        </div>;
    }

    private handleKeyDown = (e: KeyboardEvent) => {
        if (!this.props.active)
            return;

        if (e.code === "KeyG") {
            this.setState({showGeometry: !this.state.showGeometry});
        } else if (e.code === "Escape") {
            this.setState({paused: !this.state.paused});
        }
    }

    setState<K extends keyof IState>(state: Pick<IState, K> | IState | null) {
        super.setState(state, () => {
            this.props.onChange({text: JSON.stringify(this.state)});
        });
    }
}