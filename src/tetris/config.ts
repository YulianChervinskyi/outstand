export interface IPiece {
    color: number;
    shape: number[][];
}

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const COLORS = [
    "#EE2733",
    "#F89622",
    "#FDE100",
    "#4EB748",
    "#2BACE2",
    "#005A9D",
    "#922B8C",
];

export const PIECES: IPiece[] = [
    {
        color: 0,
        shape: [
            [0, 0, 0, 0],
            [1, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ],
    }, {
        color: 1,
        shape: [
            [0, 0, 0, 0],
            [0, 0, 1, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0],
        ],
    }, {
        color: 2,
        shape: [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
        ],
    }, {
        color: 3,
        shape: [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 0],
        ],
    }, {
        color: 4,
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
    }, {
        color: 5,
        shape: [
            [0, 0, 0, 0],
            [1, 0, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0],
        ],
    }, {
        color: 6,
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0],
        ],
    }
];
