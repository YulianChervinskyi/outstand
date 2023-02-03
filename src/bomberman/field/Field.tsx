import "./Field.scss";
import {GameModel} from "../GameModel";
import {FIELD_SIZE, bckColors} from "../config";

export function Field() {
    const model = new GameModel(FIELD_SIZE);

    return (
        <div className="common-size field">
            {model.field.map((row, rowKey) =>
                <div className="common-size field-row" key={rowKey}>
                    {row.map((cell, cellKey) =>
                        <div className="common-size field-cell"
                             key={cellKey}
                             style={{backgroundColor: `${bckColors[cell]}`}}/>
                    )}
                </div>
            )}
        </div>
    );
}