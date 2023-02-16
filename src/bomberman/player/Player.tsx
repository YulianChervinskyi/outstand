import {player} from "../assets/index";
import {CELL_SIZE, PLAYER_SIZE} from "../config";
import "./Player.scss";

export function Player(props: { position: { row: number, col: number } }) {
    const coords = {
        x: props.position.row * CELL_SIZE,
        y: props.position.col * CELL_SIZE,
    }

    const style = {
        left: `${coords.x + CELL_SIZE / 2}px`,
        top: `${coords.y + CELL_SIZE / 2}px`,
        width: PLAYER_SIZE,
    };

    return <img className="player" src={player} style={style} alt=""/>;
}