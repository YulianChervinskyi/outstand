import "./Field.scss";
import {GameModel} from "../models/GameModel";
import {cellImg, CELL_SIZE} from "../config";
import {ECellType} from "../types";

export function Field(props: { model: GameModel }) {
    return (
        <div className="common-size field">
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
                             }}
                        >
                            {(cell === ECellType.Wall || cell === ECellType.AzovSteel || cell === ECellType.Bomb)
                                && <img src={cellImg[cell]} alt=""/>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}