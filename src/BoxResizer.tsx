import React from "react";

export interface IBoxResizerProps {
    width: number,
    height: number,
    onResize: (size: { width: number, height: number }) => void,
}

export class BoxResizer extends React.Component<IBoxResizerProps, {pos: {x:number, y:number}, dragging: boolean}> {

    constructor(props: IBoxResizerProps) {
        super(props);
        this.state = {pos: {x: 0, y: 0}, dragging: false};
    }

    private dragging = false;
    private startX: number = 0;
    private startY: number = 0;
    private startWidth: number = this.props.width;
    private startHeight: number = this.props.height;

    private handleMouseDown = (e: React.MouseEvent) => {
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.dragging = true;
        this.setState({...this.state, dragging: true});
        document.body.onmouseup = this.handleMouseUp;
        document.body.onmousemove = this.handleMouseMove;
    }

    private handleMouseUp = (e: MouseEvent) => {
        if (this.dragging) {
            e.stopPropagation();
            console.log("mouseup");
        }

        this.setState({...this.state, dragging: false});
        this.dragging = false;
    }

    private handleMouseMove = (e: MouseEvent) => {
        if (this.dragging) {
            const x = this.startX - e.clientX;
            const y = this.startY - e.clientY;

            this.setState({...this.state, pos: {x, y}});
            this.props.onResize({width: this.startWidth - x, height: this.startHeight - y});
        }
    }

    render() {
        return (<div className="box-resizer" style={{background: this.state.dragging ? "green" : "red"}}
                     onMouseDown={this.handleMouseDown}
                     // onMouseUp={this.handleMouseUp}
                     // onMouseMove={this.handleMouseMove}
        />)
    }
}
