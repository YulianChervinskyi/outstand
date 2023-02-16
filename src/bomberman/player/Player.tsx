import {player} from "../assets/index";
import {CELL_SIZE, PLAYER_SIZE} from "../config";
import "./Player.scss";

export function Player(props: { position: { x: number, y: number } }) {
    const coords = {
        x: props.position.x * CELL_SIZE,
        y: props.position.y * CELL_SIZE,
    }

    const style = {
        left: `${coords.x + CELL_SIZE / 2}px`,
        top: `${coords.y + CELL_SIZE / 2}px`,
        width: PLAYER_SIZE,
    };

    return <img className="player" src={player} style={style} alt=""/>;
}