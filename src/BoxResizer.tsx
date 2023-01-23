import React from "react";

const MIN_WIDTH = 150;
const MIN_HEIGHT = 165;

export interface IBoxResizerProps {
    width: number,
    height: number,
    onResize: (size: { width: number, height: number }) => void,
    minSize?: { width: number, height: number },
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
        if (this.dragging)
            e.stopPropagation();

        this.setState({dragging: false});
        this.startWidth = this.props.width;
        this.startHeight = this.props.height;
        this.dragging = false;
    }

    private handleMouseMove = (e: MouseEvent) => {
        if (this.dragging) {
            const x = this.startX - e.clientX;
            const y = this.startY - e.clientY;

            this.props.onResize({
                width: Math.max(this.startWidth - x, this.props.minSize?.width || MIN_WIDTH, MIN_WIDTH),
                height: Math.max(this.startHeight - y, this.props.minSize?.height || MIN_HEIGHT, MIN_HEIGHT),
            });
        }
    }

    render() {
        return (
            <div className="box-resizer"
                 style={{background: this.state.dragging ? "rgba(69, 133, 61, 0.8)" : "rgba(163, 57, 57, 0.8)"}}
                 onMouseDown={this.handleMouseDown}
            />
        );
    }
}
