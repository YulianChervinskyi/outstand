import {GameModel} from "../GameModel";
import {player} from "../assets/index";
import {CELL_SIZE} from "../config";
import "./Player.scss";

export function Player(props: { model: GameModel }) {
    const style = {
        transform: `translate(${props.model.player.position.x}px, ${props.model.player.position.y}px)`,
        width: CELL_SIZE * 0.75,
    };

    return <img className="player" src={player} style={style} alt=""/>;
}