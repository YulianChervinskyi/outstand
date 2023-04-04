import {BonusModel} from "../models/BonusModel";
import {EBonusType} from "../types";
import "./Bonus.scss";

export function Bonus(props: { bonus: BonusModel }) {
    return <div className="bonus">
        <p>{EBonusType[props.bonus.getType]}</p>
    </div>;
}