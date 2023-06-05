import "./InfoPanel.scss";
import {images, player} from "../assets";
import {IPlayerState} from "../types";

export function InfoPanel(props: { stats: IPlayerState }) {
    const getValueByKey = (key: string) => {
        for (const [_key, value] of Object.entries(props.stats))
            if (_key === key)
                return value;
    }

    const lifeStyle = {
        border: getValueByKey('immortality') ? "5px ridge white" : "5px ridge #1f1f1f",
    };

    const supplyStyle = {
        border: getValueByKey('diarrhea')
            ? "5px ridge red" : props.stats.pushAbility
                ? "5px ridge green" : "5px ridge #1f1f1f",
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
                    {getValueByKey('currSupply')}
                </div>
            </div>
        </div>
    );
}