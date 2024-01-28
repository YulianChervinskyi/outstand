import React from "react";
import {IComponentProps} from "../Box";
import {Camera} from "./Camera";
import {Controls} from "./Controls";
import {GameLoop} from "./GameLoop";
import {Player} from "./Player";
import {Map} from "./Map";

interface IState {
    paused: boolean;
    playerData: { x: number, y: number, direction: number };
    mapData?: number[];
}

const initialState: IState = {
    paused: false,
    playerData: {x: 15.3, y: -1.2, direction: Math.PI * 0.3},
}

export class Fpe extends React.Component<IComponentProps, IState> {

    private readonly canvasRef = React.createRef<HTMLCanvasElement>();
    private readonly player: Player;
    private readonly map: Map;
    private readonly loop = new GameLoop();

    private _controls: Controls | undefined;
    private _camera: Camera | undefined;

    private pointerLock = false;
    private init = true;

    constructor(props: IComponentProps) {
        super(props);
        this.state = this.props.text ? JSON.parse(this.props.text) : initialState;
        this.props.onChangeGeometry({minSize: {w: 320, h: 240}, aspectRatio: {w: 4, h: 3}});

        const x = this.state.playerData?.x || initialState.playerData.x;
        const y = this.state.playerData?.y || initialState.playerData.y
        const direction = this.state.playerData?.direction || initialState.playerData.direction;
        this.player = new Player(x, y, direction);

        this.map = new Map(32, this.state.mapData);
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
            this.loop.start(this.tick);
        }
    }

    componentWillUnmount() {
        this.loop.stop();
    }

    private tick = (seconds: number) => {
        if (!this.init && (!this.props.active || this.state.paused))
            return;

        this.map.update(seconds);
        this.player.update(this.controls.states, this.map, seconds);
        this.camera.render(this.player, this.map);

        if (this.init) {
            this.init = false;
            return;
        }

        this.setState({
            playerData: {
                x: this.player.x,
                y: this.player.y,
                direction: this.player.direction
            },
            mapData: Array.from(this.map.wallGrid)
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
}
