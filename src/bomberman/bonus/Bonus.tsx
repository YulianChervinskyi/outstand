import {BonusModel} from "../models/BonusModel";
import {EBonusType} from "../types";
import {bonus_img} from "../assets";
import React from "react";
import "./Bonus.scss";

export function Bonus(props: { bonus: BonusModel }) {
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

    return <div className="bonus-box">
        <img className="bonus" src={getSrc()} alt="wall"/>
    </div>
}