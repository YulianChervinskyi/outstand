import {GameField} from "./GameField";
import {ControlPanel, DifficultyType} from "./ControlPanel";
import React from "react";

export interface IProps {
    width: number,
    height: number,
    text: string,
    onChange: (e: { text: string }) => void,
}

interface IState {
    timer: number,
    currDifficulty: DifficultyType,
    flagNumber: number,
    board: number[][],
}

export class Minesweeper extends React.Component<IProps, IState> {
    intervalId: NodeJS.Timeout | undefined = undefined;
    isGameStarted = true;
    counter = 0;

    constructor(props: IProps) {
        super(props);
        this.state = {
            timer: 0,
            currDifficulty: DifficultyType.Easy,
            flagNumber: 10,
            board: Array(10).fill(Array(10).fill(-1)),
        };
    }

    componentDidMount() {
        this.intervalId = setInterval(() => {
            this.counter++;
            this.setState({timer: this.counter});
            if (this.counter === 999)
                clearInterval(this.intervalId);
        }, 1000);
    }

    componentWillUnmount() {
        if (this.intervalId)
            clearInterval(this.intervalId);

        this.intervalId = undefined;
    }

    render() {
        return (
            <div style={{width: "100%", height: "100%", backgroundColor: "#819462"}}>
                <ControlPanel
                    time={this.state.timer}
                    flagNumber={this.state.flagNumber}
                    changeDifficulty={(difficulty) => this.setState({currDifficulty: difficulty})}
                />
                <GameField
                    // parameters={this.gameParameters}
                    gameFieldActivated={(value) => this.isGameStarted = value}
                />
            </div>
        );
    }
}