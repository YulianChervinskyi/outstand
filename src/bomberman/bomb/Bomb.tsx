import {ECellType} from "../types";
import {cellImg} from "../config";

export function Bomb() {
    return (
        <img src={cellImg[ECellType.Bomb]} alt=""/>
    );
}