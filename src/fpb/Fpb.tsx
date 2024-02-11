import React from "react";
import {IComponentProps} from "../Box";
import {Camera} from "./Camera";
import {Controls} from "./Controls";
import {Player} from "./Player";
import {Map} from "./Map";

interface IState {
    paused: boolean;
    showMap: boolean;
    showInfo: boolean;
    playerData: { x: number, y: number, direction: number };
    mapData?: number[];
}

const initialState: IState = {
    paused: false,
    showMap: false,
    showInfo: true,
    playerData: {x: 15.3, y: -1.2, direction: Math.PI * 0.3},
}

export class Fpb extends React.Component<IComponentProps, IState> {

    private readonly canvasRef = React.createRef<HTMLCanvasElement>();
    private readonly map;
    private readonly player;

    private _controls: Controls | undefined;
    private _camera: Camera | undefined;

    private pointerLock = false;
    private lastTime = 0;
    private initialized = false;

    constructor(props: IComponentProps) {
        super(props);
        this.state = this.props.text ? JSON.parse(this.props.text) : initialState;
        this.props.onChangeGeometry({minSize: {w: 320, h: 240}, aspectRatio: {w: 4, h: 3}});

        this.map = new Map(32, this.state.mapData);

        const x = this.state.playerData?.x || initialState.playerData.x;
        const y = this.state.playerData?.y || initialState.playerData.y
        const direction = this.state.playerData?.direction || initialState.playerData.direction;
        this.player = new Player(x, y, direction);
    }

    get controls() {
        if (!this._controls)
            throw new Error("component did not mount");

        return this._controls;
    }

    get camera() {
        if (!this._camera)
            throw new Error("component did not mount");

        return this._camera;
    }

    componentDidMount() {
        if (this.canvasRef.current) {
            this._controls = new Controls(this.canvasRef.current);
            this._camera = new Camera(this.canvasRef.current, 640, 0.8);
            requestAnimationFrame(this.drawFrame);
        }
        document.addEventListener("keydown", this.handleKeyDown);

        if (!this.state.mapData) {
            this.setState({mapData: Array.from(this.map.wallGrid)});
        }
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    private drawFrame = (time: number) => {
        this.tick(time);
        requestAnimationFrame(this.drawFrame);
    }

    private tick = (time: number) => {
        if ((!this.props.active || this.state.paused) && this.initialized)
            return;

        const seconds = (time - this.lastTime) / 1000;
        this.lastTime = time;

        if (seconds > 0 && seconds < 0.2) {
            this.initialized = true;
            this.player.update(this.controls.states, this.map, seconds);
            this.camera.render(this.player, this.map, this.state);
        }

        this.setState({
            playerData: {
                x: this.player.x,
                y: this.player.y,
                direction: this.player.direction
            },
        });


        if (this.pointerLock && !this.controls.states.pointerLock) {
            this.setState({paused: true});
        }

        this.pointerLock = this.controls.states.pointerLock;
    }

    setState<K extends keyof IState>(state: Pick<IState, K> | IState | null) {
        super.setState(state, () => {
            this.props.onChange({text: JSON.stringify(this.state)});
        });
    }

    continueGame = () => {
        this.setState({paused: false});
        this.controls.requestPointerLock();
    }

    resetGame = () => {
        this.setState(initialState);
    }

    componentDidUpdate(prevProps: Readonly<IComponentProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (this.state.paused)
            return;

        if (prevProps.active && !this.props.active)
            this.setState({...this.state, paused: !this.state.paused});
    }

    render() {
        return <div className="fpe">
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
        if (e.code === "KeyM") {
            this.setState({showMap: !this.state.showMap});
        } else if (e.code === "KeyI") {
            this.setState({showInfo: !this.state.showInfo});
        }
    }
}
