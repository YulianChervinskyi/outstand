import {BonusModel} from "../models/BonusModel";
import {EBonusType} from "../types";
import {bonus_img} from "../assets";
import React from "react";
import "./Bonus.scss";

export function Bonus(props: { bonus: BonusModel }) {
    const value = Math.round(performance.now() / 10);

    const getSrc = () => {
        switch (props.bonus._type) {
            case EBonusType.Lottery:
                return bonus_img.lottery;
            case EBonusType.Push:
                return bonus_img.push;
            case EBonusType.Supply:
                return bonus_img.supply;
            case EBonusType.Speed:
                return bonus_img.speed;
            case EBonusType.Spam:
                return bonus_img.spam;
            case EBonusType.Power:
                return bonus_img.power;
        }
    }

    return <img
        style={{background: `repeating-conic-gradient(from ${value}deg at 50%, #FF0000 0deg 10deg, #FFA500 10deg 20deg, #FFFF00 20deg 30deg, #7FFF00 30deg 40deg, #00FFFF 40deg 50deg, #0000FF 50deg 60deg, #9932CC 60deg 70deg, #FF1493 70deg 80deg)`}}
        className="bonus"
        src={getSrc()}
        alt="wall"
    />
}