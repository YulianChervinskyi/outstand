import "./Field.scss";
import {GameModel} from "../GameModel";
import {bckColors, CELL_SIZE} from "../config";

export function Field(props: {model: GameModel}) {

    return (
        <div className="common-size field">
            {props.model.field.map((row, rowKey) =>
                <div className="common-size field-row" key={rowKey}>
                    {row.map((cell, cellKey) =>
                        <div className="common-size field-cell"
                             key={cellKey}
                             style={{
                                 backgroundColor: `${bckColors[cell]}`,
                                 width: `${CELL_SIZE}px`,
                                 height: `${CELL_SIZE}px`,
                                 minWidth: `${CELL_SIZE}px`,
                                 minHeight: `${CELL_SIZE}px`,
                             }}
                        />
                    )}
                </div>
            )}
        </div>
    );
}