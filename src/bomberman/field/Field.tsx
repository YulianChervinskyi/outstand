import React from "react";
import {images} from "../assets";
import {Bomb} from "../bomb/Bomb";
import {Explosion} from "../bomb/explosion/Explosion";
import {Bonus} from "../bonus/Bonus";
import {CELL_SIZE} from "../config";
import {BonusModel} from "../models/BonusModel";
import {GameModel} from "../models/GameModel";
import {ECellType, IPoint} from "../types";
import "./Field.scss";

export function Field(props: { model: GameModel, offset: IPoint }) {

    const getCellObject = (type: ECellType, pos: IPoint) => {
        switch (type) {
            case ECellType.Bomb:
                return <Bomb/>;
            case ECellType.Explosion:
                return <Explosion/>;
            case ECellType.Bonus:
                return <Bonus bonus={props.model.getObject(pos) as BonusModel}/>;
            case ECellType.Wall:
                return <img src={images.wall} alt="wall"/>;
            case ECellType.AzovSteel:
                return <img src={images.azov_steel} alt="azov_steel"/>;
            default:
                return "";
        }
    }

    return (
        <div className="field" style={{left: props.offset.x, top: props.offset.y}}>
            {props.model.field.map((row, rowKey) =>
                <div className="field-row" key={rowKey}>
                    {row.map((cell, cellKey) =>
                        <div className="field-cell"
                             key={cellKey}
                             style={{
                                 backgroundColor: /*cell ? `${cellImg[cell]}` : "*/"#252533",
                                 width: `${CELL_SIZE}px`,
                                 height: `${CELL_SIZE}px`,
                                 minWidth: `${CELL_SIZE}px`,
                                 minHeight: `${CELL_SIZE}px`,
                             }}>
                            {getCellObject(cell, {x: cellKey, y: rowKey})}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

