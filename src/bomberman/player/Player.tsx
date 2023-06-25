import {IPoint} from "../types";
import {playerImg} from "../assets";
import {CELL_SIZE} from "../config";
import "./Player.scss";
import {PlayerModel} from "../models/PlayerModel";

export function Player(props: { player: PlayerModel, offset: IPoint, id: number }) {
    const posStyle = {
        left: `${CELL_SIZE * props.player.pos.x + props.offset.x + 1}px`,
        top: `${CELL_SIZE * props.player.pos.y + props.offset.y + 1}px`,
    };

    return <div className="player" style={posStyle}>
        {props.player.states.left && <div className="control left"/>}
        {props.player.states.right && <div className="control right"/>}
        {props.player.states.up && <div className="control up"/>}
        {props.player.states.down && <div className="control down"/>}
        {props.player.states.place && <div className="control bomb"/>}
        <img className="player" src={playerImg[props.id]} style={{width: CELL_SIZE}} alt="player"/>
    </div>;
}