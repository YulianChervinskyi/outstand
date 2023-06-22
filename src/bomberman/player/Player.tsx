import {IPoint} from "../types";
import {playerImg} from "../assets";
import {CELL_SIZE} from "../config";
import "./Player.scss";

export function Player(props: { position: IPoint, offset: IPoint, id: number }) {
    const style = {
        left: `${CELL_SIZE * props.position.x + props.offset.x + 1}px`,
        top: `${CELL_SIZE * props.position.y + props.offset.y + 1}px`,
        width: CELL_SIZE,
    };

    return <img className="player" src={playerImg[props.id]} style={style} alt="player"/>;
}