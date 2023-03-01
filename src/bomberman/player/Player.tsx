import {IPoint} from "../../asteroids/types";
import {player} from "../assets/index";
import {CELL_SIZE} from "../config";
import "./Player.scss";

export function Player(props: { position: IPoint, offset: IPoint }) {
    const style = {
        left: `${CELL_SIZE * props.position.x + props.offset.x + 1}px`,
        top: `${CELL_SIZE * props.position.y + props.offset.y + 1}px`,
        width: CELL_SIZE,
    };

    return <img className="player" src={player} style={style} alt=""/>;
}