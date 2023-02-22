import {IPoint} from "../../asteroids/types";
import {player} from "../assets/index";
import {CELL_SIZE} from "../config";
import "./Player.scss";

export function Player(props: { position: IPoint, offset: IPoint }) {
    const style = {
        left: `${CELL_SIZE * (props.position.x) + 1 + props.offset.x}px`,
        top: `${CELL_SIZE * (props.position.y) + 1 + props.offset.y}px`,
        width: CELL_SIZE,
    };

    return <img className="player" src={player} style={style} alt=""/>;
}