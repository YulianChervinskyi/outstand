import {COLORS} from "./config";
import {PieceModel} from "./PieceModel";

export function Piece(props: { piece: PieceModel }) {
    return (
        <div>
            {props.piece.shape.map((row, y) =>
                <div key={y} style={{height: "10px"}}>
                    {row.map((cell, x) =>
                        <div key={x}
                             style={{
                                 width: "10px",
                                 height: "10px",
                                 backgroundColor: cell ? COLORS[props.piece.color] : "transparent",
                                 display: "inline-block",
                             }}>
                        </div>)}
                </div>)}
        </div>
    );
}
