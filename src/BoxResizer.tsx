import React from "react";
import {IGeometry} from "./Box";

const MIN_WIDTH = 150;
const MIN_HEIGHT = 165;
const HEADER = 20;
const BORDER = 2;
const WIDTH_EXTRA = 2 * BORDER;
const HEIGHT_EXTRA = HEADER + 2 * BORDER;

export interface IBoxResizerProps {
    width: number,
    height: number,
    onResize: (size: { w: number, h: number }) => void,
    geometry?: IGeometry,
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

    componentDidUpdate(prevProps: Readonly<IBoxResizerProps>, prevState: Readonly<{
        dragging: boolean
    }>, snapshot?: any) {
        if (prevProps.geometry?.minSize?.w !== this.props.geometry?.minSize?.w ||
            prevProps.geometry?.minSize?.h !== this.props.geometry?.minSize?.h ||
            prevProps.geometry?.aspectRatio?.w !== this.props.geometry?.aspectRatio?.w ||
            prevProps.geometry?.aspectRatio?.h !== this.props.geometry?.aspectRatio?.h) {
            // initial resize
            this.resize(this.props.width, this.props.height)
        }
    }

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
            this.resize(this.startWidth - x, this.startHeight - y)
        }
    }

    private resize = (width: number, height: number) => {
        let w = width - WIDTH_EXTRA;
        let h = height - HEIGHT_EXTRA;

        if (this.props.geometry?.aspectRatio) {
            const {w: aw, h: ah} = this.props.geometry.aspectRatio;
            if (w / h > aw / ah) {
                w = h * aw / ah;
            } else {
                h = w * ah / aw;
            }
        }

        this.props.onResize({
            w: Math.max(w, this.props.geometry?.minSize?.w || MIN_WIDTH, MIN_WIDTH) + WIDTH_EXTRA,
            h: Math.max(h, this.props.geometry?.minSize?.h || MIN_HEIGHT, MIN_HEIGHT) + HEIGHT_EXTRA,
        });
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
