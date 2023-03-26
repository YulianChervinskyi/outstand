import {Explosion} from "../bomb/explosion/Explosion";
import {BonusModel} from "../models/BonusModel";
import {GameModel} from "../models/GameModel";
import {Bonus} from "../bonus/Bonus";
import {CELL_SIZE} from "../config";
import {ECellType, IPoint} from "../types";
import {Bomb} from "../bomb/Bomb";
import {images} from "../assets";
import "./Field.scss";

interface cVisual {
    [id: number]: JSX.Element | Element
}

export function Field(props: { model: GameModel, offset: IPoint }) {
    const cell: cVisual = {
        [ECellType.Empty]: new HTMLDivElement(),
        [ECellType.Wall]: createImg(new Image(), images.wall),
        [ECellType.AzovSteel]: createImg(new Image(), images.azov_steel),
        [ECellType.Bomb]: <Bomb/>,
        [ECellType.Explosion]: <Explosion/>,
        [ECellType.Bonus]: <Bonus bonus={props.model.getObject({x: 0, y: 0}) as BonusModel}/>,
    };

    return (
        <div className="field" style={{left: props.offset.x, top: props.offset.y}}>
            {props.model.field.map((row, rowKey) =>
                <div className="field-row" key={rowKey}>
                    {row.map((_cell, cellKey) =>
                        <div className="field-cell"
                             key={cellKey}
                             style={{
                                 backgroundColor: /*cell ? `${cellImg[cell]}` : "*/"#252533",
                                 width: `${CELL_SIZE}px`,
                                 height: `${CELL_SIZE}px`,
                                 minWidth: `${CELL_SIZE}px`,
                                 minHeight: `${CELL_SIZE}px`,
                             }}>
                            {cell[_cell]}
                            {/*{cell === ECellType.Bomb && <Bomb/>}*/}
                            {/*{(cell === ECellType.Wall || cell === ECellType.AzovSteel)*/}
                            {/*    && <img src={cellImg[cell]} alt=""/>}*/}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

const createImg = (img: HTMLImageElement, src: string) => {
    img.src = src;
    return img;
}