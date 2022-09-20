export interface IBoxHeaderProps {
    onMove:(pos: {x: number, y:number}) => void,
    onClose:() => void,
}

export function BoxHeader(props: IBoxHeaderProps) {
    return (
        <div className="box-header">
        </div>
    );
}
