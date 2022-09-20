export interface IBoxResizerProps {
    onResize:(size: {width: number, height:number}) => void,
}

export function BoxResizer(props: IBoxResizerProps) {
    return (
        <div className="box-resizer">
        </div>
    );
}
