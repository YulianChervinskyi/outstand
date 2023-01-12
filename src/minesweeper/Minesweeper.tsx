import {GameField} from "./GameField";
import {ControlPanel, DifficultyType} from "./ControlPanel";
import {useState} from "react";

export interface MinesweeperProps {
    width: number,
    height: number,
    text: string,
    onChange: (e: { text: string }) => void,
}

export function Minesweeper(props: MinesweeperProps) {
    const [isGameStarted, setIsGameStarted] = useState(false);
    // const [currDifficulty, setCurrDifficulty] = useState<DifficultyType>();
    const [gameParameters, setGameParameters] = useState<{
        flagNumber: number,
        bombNumber: number,
        board: number[][],
    }>();


    const handleChangeDifficulty = (difficulty: DifficultyType) => {
        /*feel gameParameters depends on difficulty*/
    }

    // board: Array(BOARD_HEIGHT).fill(Array(BOARD_WIDTH).fill(-1)),

    return (
        <div style={{width: "100%", height: "100%", backgroundColor: "#819462"}}>
            <ControlPanel
                isGameStarted={isGameStarted}
                flagNumber={gameParameters?.flagNumber}
                changeDifficulty={handleChangeDifficulty}
            />
            <GameField
                parameters={gameParameters}
                gameFieldActivated={(value) => setIsGameStarted(value)}
            />
        </div>
    );
}