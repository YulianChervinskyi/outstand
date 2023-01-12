import React from "react";

interface IGameField {
    parameters: {
        flagNumber: number,
        bombNumber: number,
        board: number[][],
    } | undefined;
    gameFieldActivated: (isActivated: boolean) => void;
}

export function GameField (props: IGameField) {

    return (
        <div>

        </div>
    );
}