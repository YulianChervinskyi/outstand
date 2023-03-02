import "./Field.scss";
import {IPoint} from "../../asteroids/types";
import {GameModel} from "../models/GameModel";
import {CELL_SIZE, cellImg} from "../config";
import {ECellType} from "../types";
import {Bomb} from "../bomb/Bomb";

export function Field(props: { model: GameModel, offset: IPoint }) {
    return (
        <div className="field" style={{left: props.offset.x, top: props.offset.y}}>
            {props.model.field.map((row, rowKey) =>
                <div className="field-row" key={rowKey}>
                    {row.map((cell, cellKey) =>
                        <div className="field-cell"
                             key={cellKey}
                             style={{
                                 backgroundColor: cell ? `${cellImg[cell]}` : "#252533",
                                 width: `${CELL_SIZE}px`,
                                 height: `${CELL_SIZE}px`,
                                 minWidth: `${CELL_SIZE}px`,
                                 minHeight: `${CELL_SIZE}px`,
                             }}>
                            {cell === ECellType.Bomb && <Bomb/>}
                            {(cell === ECellType.Wall || cell === ECellType.AzovSteel)
                                && <img src={cellImg[cell]} alt=""/>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}