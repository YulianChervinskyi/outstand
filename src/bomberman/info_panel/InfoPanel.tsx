import "./InfoPanel.scss";
import {IPlayerStats} from "../types";

export function InfoPanel(props: { stats: IPlayerStats }) {

    const parseObject = (obj: object) => {
        return Object.entries(obj).map(([key, value]) =>
            <div key={key}>
                {`${key}`}
                <div>{
                    value instanceof Object
                        ? parseObject(value)
                        : typeof (value) === "number" ? value.toFixed(4) : value
                }</div>
            </div>)
    }

    return (
        <div className="info-panel">
            <div className="player-stats">
                {parseObject(props.stats)}
            </div>
        </div>
    );
}