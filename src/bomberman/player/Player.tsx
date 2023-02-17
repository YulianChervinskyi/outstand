import {player} from "../assets/index";
import {CELL_SIZE} from "../config";
import "./Player.scss";

export function Player(props: { position: { x: number, y: number } }) {
    const style = {
        left: `${CELL_SIZE * (props.position.x)}px`,
        top: `${CELL_SIZE * (props.position.y)}px`,
        width: CELL_SIZE,
    };

    return <img className="player" src={player} style={style} alt=""/>;
}