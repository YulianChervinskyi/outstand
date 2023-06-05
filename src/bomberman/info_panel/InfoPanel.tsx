import {images, player} from "../assets";
import {IFullPlayerState} from "../types";
import "./InfoPanel.scss";

export function InfoPanel(props: { stats: IFullPlayerState }) {
    const lifeStyle = {
        border: props.stats.immortality ? "5px ridge white" : "5px ridge #1f1f1f",
    };

    const supplyStyle = {
        border: props.stats.diarrhea
            ? "5px ridge red"
            : props.stats.pushAbility ? "5px ridge green" : "5px ridge #1f1f1f",
    };

    return (
        <div className="info-panel">
            <div className="name">Player1</div>
            <div className="section">
                <img style={lifeStyle} src={player} alt="life"/>
                <div className="value">{props.stats.life}</div>
            </div>
            <div className="section">
                <img style={supplyStyle} src={images.bomb} alt="supply"/>
                <div className="value">
                    {props.stats.currSupply}
                </div>
            </div>
        </div>
    );
}