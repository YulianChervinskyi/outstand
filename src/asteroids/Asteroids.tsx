import React from "react";
import {IComponentProps} from "../Box";
import {Game} from "./Game";
import {Scene} from "./Scene";

export class Asteroids extends React.Component<IComponentProps, {}> {
    lastTime = 0;
    canvasRef = React.createRef<HTMLCanvasElement>();
    scene?: Scene;
    game = new Game();

    constructor(props: IComponentProps) {
        super(props);
    }

    componentDidMount() {
        if (this.canvasRef.current) {
            this.scene = new Scene(this.canvasRef.current);
            requestAnimationFrame(this.frame);
        }
    }

    componentWillUnmount() {
        this.scene = undefined;
    }

    frame = (time: number) => {
        const seconds = (time - this.lastTime) / 1000;
        this.lastTime = time;

        if (seconds > 0 && seconds < 0.2)
            this.tick(seconds);

        if (this.scene)
            requestAnimationFrame(this.frame);
    }

    private tick = (seconds: number) => {
        this.game.update(seconds, this.props.active);
        this.scene?.render(this.game);
    }

    render() {
        return <canvas ref={this.canvasRef} width={this.props.width} height={this.props.height}/>
    }
}
