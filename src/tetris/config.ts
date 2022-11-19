export interface IShape {
    color: number;
    body: number[][];
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

export const SHAPES: IShape[] = [
    {
        color: 0,
        body: [
            [0, 0, 0, 0],
            [1, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ],
    }, {
        color: 1,
        body: [
            [0, 0, 0, 0],
            [0, 0, 1, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0],
        ],
    }, {
        color: 2,
        body: [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
        ],
    }, {
        color: 3,
        body: [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 0],
        ],
    }, {
        color: 4,
        body: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
    }, {
        color: 5,
        body: [
            [0, 0, 0, 0],
            [1, 0, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0],
        ],
    }, {
        color: 6,
        body: [
            [0, 0, 0, 0],
            [1, 1, 1, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0],
        ],
    }
];
