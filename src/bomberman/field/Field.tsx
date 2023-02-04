import "./Field.scss";
import {GameModel} from "../GameModel";
import {cellFilling, CELL_SIZE} from "../config";
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
                                 backgroundColor: cell === 0 && cell > 3 ? `${cellFilling[cell]}` : "unset",
                                 width: `${CELL_SIZE}px`,
                                 height: `${CELL_SIZE}px`,
                                 minWidth: `${CELL_SIZE}px`,
                                 minHeight: `${CELL_SIZE}px`,
                             }}
                        >
                            {(cell === ECellType.Wall || cell === ECellType.AzovSteel || cell === ECellType.Bomb)
                                && <img src={cellFilling[cell]} alt=""/>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}