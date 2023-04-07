import "./InfoPanel.scss";
import {IPlayerStats} from "../types";

export function InfoPanel(props: { stats: IPlayerStats }) {
    return (
        <div className="info-panel">
            <div className="player-stats">
                {Object.entries(props.stats).map(([key, value]) =>
                    !(value instanceof Object) && <div key={key}>
                        {`${key}`}
                        <div>{`${(value)}`}</div>
                    </div>)}
            </div>
        </div>
    );
}