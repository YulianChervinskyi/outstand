import React from "react";
import {IComponentProps} from "../Box";
import {Game} from "./Game";
import {GameInfo} from "./GameInfo";
import {Scene} from "./Scene";

export class Asteroids extends React.Component<IComponentProps, { paused: boolean, gameOver: boolean }> {
    lastTime = 0;
    canvasRef = React.createRef<HTMLCanvasElement>();
    game = new Game(() => this.setState({gameOver: true}));
    scene?: Scene;
    gameInfo?:GameInfo;

    constructor(props: IComponentProps) {
        super(props);
        this.state = {paused: false, gameOver: false};
    }

    componentDidMount() {
        document.body.addEventListener("keydown", this.handleKeyDown);
        if (this.canvasRef.current) {
            this.scene = new Scene(this.canvasRef.current, this.game);
            this.gameInfo = new GameInfo(this.canvasRef.current, this.game);
            requestAnimationFrame(this.frame);
        }
    }

    componentWillUnmount() {
        document.body.removeEventListener("keydown", this.handleKeyDown);
        this.scene = undefined;
    }

    handleKeyDown = (e: KeyboardEvent) => {
        if (!this.props.active || this.state.gameOver)
            return;

        switch (e.key) {
            case "Escape":
                this.handlePause();
        }
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
        if (this.props.active) {
            const data = this.game.serialize();
            this.props.onChange({text: this.game.serialize()});
        }

        this.scene?.render();
        this.gameInfo?.render();
    }

    private handlePause = () => {
        this.game.pause(!this.state.paused);
        this.setState({paused: !this.state.paused});
    }

    private handleReset = () => {
        this.game.reset();
        this.setState({paused: false, gameOver: false});
    }

    render() {
        return <div>
            <canvas ref={this.canvasRef} width={this.props.width} height={this.props.height}/>
            {this.state.paused && <div className="info-overlay">
                Paused
                <div className="controls">
                    <button onClick={this.handlePause}>Continue</button>
                    <button onClick={this.handleReset}>Restart</button>
                </div>
            </div>}
            {this.state.gameOver && <div className="info-overlay">
                Game Over
                <div className="controls">
                    <button onClick={this.handleReset}>Restart</button>
                </div>
            </div>}

        </div>
    }
}
