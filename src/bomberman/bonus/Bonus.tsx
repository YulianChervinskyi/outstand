import {BonusModel} from "../models/BonusModel";

export function Bonus(props: {bonus: BonusModel}) {
    return <div style={{backgroundColor: "#e80e2b"}}>{props.bonus.type}</div>;
}