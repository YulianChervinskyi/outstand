import React from "react";
import {IComponentProps} from "../Box";
import {Camera} from "./Camera";
import {Controls} from "./Controls";
import {GameLoop} from "./GameLoop";
import {Player} from "./Player";
import {Map} from "./Map";

export class Fpe extends React.Component<IComponentProps, {}> {

    canvasRef = React.createRef<HTMLCanvasElement>();
    player = new Player(15.3, -1.2, Math.PI * 0.3);
    map = new Map(32);
    controls = new Controls();
    camera: Camera | undefined;
    loop = new GameLoop();

    constructor(props: IComponentProps) {
        super(props);
        this.map.randomize();
    }

    componentDidMount() {
        if (this.canvasRef.current) {
            this.camera = new Camera(this.canvasRef.current, 320, 0.8);
            this.loop.start(this.tick);
        }
    }

    componentWillUnmount() {
        this.loop.stop();
    }

    private tick = (seconds: number) => {
        this.map.update(seconds);

        if (this.props.active)
            this.player.update(this.controls.states, this.map, seconds);

        this.camera?.render(this.player, this.map);
    }

    render() {
        return <canvas ref={this.canvasRef} style={{width: "100%", height: "100%"}}/>
    }
}
