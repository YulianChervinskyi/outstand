import React from "react";

interface ISquare {
    squares:{
        [id:number]:{
            value: string,
            unOpen: boolean,
        }}
}

export class Square extends React.Component<ISquare> {

    constructor(props:ISquare) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div/>
        );
    }
}