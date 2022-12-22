import React from "react";
import {IComponentProps} from "../Box";
import {Game} from "./Game";
import {Scene} from "./Scene";

export class Asteroids extends React.Component<IComponentProps, { paused: boolean, gameOver: boolean }> {
    lastTime = 0;
    canvasRef = React.createRef<HTMLCanvasElement>();
    scene?: Scene;
    game = new Game();

    constructor(props: IComponentProps) {
        super(props);
        this.state = {paused: true, gameOver: false};
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

    private resetGame = () => {

    }

    render() {
        return <div>
            <canvas ref={this.canvasRef} width={this.props.width} height={this.props.height}/>
            {this.state.paused && <div className="info-overlay">
                Paused
                <div className="controls">
                    <button onClick={() => this.setState({paused: false})}
                    >Continue
                    </button>
                    <button onClick={this.resetGame}>Restart</button>
                </div>
            </div>}
            {this.state.gameOver && <div className="info-overlay">
                Game Over
                <div className="controls">
                    <button onClick={this.resetGame}>Restart</button>
                </div>
            </div>}

        </div>
    }
}
