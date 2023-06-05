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
                <div style={lifeStyle} className="img-box">
                    <img  src={player} alt="life"/>
                </div>
                <div className="value">{props.stats.life}</div>
            </div>
            <div className="section">
                <div style={supplyStyle} className="img-box">
                    <img src={images.bomb} alt="supply"/>
                </div>
                <div className="value">
                    {props.stats.currSupply}
                </div>
            </div>
        </div>
    );
}