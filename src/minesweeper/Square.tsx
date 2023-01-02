import React from "react";

interface ISquareData {
    value: string,
    clicked: boolean,
}

interface ISquare {
    squares: { [id: number]: ISquareData }
}

export class Square extends React.Component<{}, ISquare> {


    constructor(props: {}) {
        super(props);
        this.state = {squares: {}};
    }

    render() {
        return (
            <div></div>
        );
    }
}