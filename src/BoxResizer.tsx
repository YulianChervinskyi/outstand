import React from "react";

export interface IBoxResizerProps {
    width: number,
    height: number,
    onResize: (size: { width: number, height: number }) => void,
}

export class BoxResizer extends React.Component<IBoxResizerProps, { dragging: boolean }> {

    constructor(props: IBoxResizerProps) {
        super(props);
        this.state = {dragging: false};
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
        this.setState({dragging: true});

        document.body.onmouseup = this.handleMouseUp;
        document.body.onmousemove = this.handleMouseMove;
    }

    private handleMouseUp = (e: MouseEvent) => {
        if (this.dragging) {
            e.stopPropagation();
            console.log("mouseup");
        }

        this.setState({dragging: false});
        this.startWidth = this.props.width;
        this.startHeight = this.props.height;
        this.dragging = false;
    }

    private handleMouseMove = (e: MouseEvent) => {
        if (this.dragging) {
            const x = this.startX - e.clientX;
            const y = this.startY - e.clientY;

            this.props.onResize({width: this.startWidth - x, height: this.startHeight - y});
        }
    }

    render() {
        return (
            <div className="box-resizer" style={{background: this.state.dragging ? "green" : "red"}}
                 onMouseDown={this.handleMouseDown}
            />
        )
    }
}
