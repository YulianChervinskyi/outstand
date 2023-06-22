import {images, playerImg} from "../assets";
import {IFullPlayerState} from "../types";
import "./InfoPanel.scss";

export function InfoPanel(props: { stats: IFullPlayerState[] }) {
    return (
        <div className="info-panel">
            {props.stats.map((state, key) =>
                <div className="info-box"
                     style={{
                         width: `${100 / props.stats.length}%`,
                         justifyContent: (key + 1) % 2 ? "flex-start" : "flex-end",
                     }}>
                    <div className="name">{`Player ${key + 1}`}</div>
                    <div className="state-box">
                        <div className="img-box"
                             style={{border: state.immortality ? "5px ridge white" : "5px ridge #1f1f1f"}}>
                            <img src={playerImg[key]} alt="life"/>
                        </div>
                        <div className="value">{state.life}</div>
                        <div className="img-box"
                             style={{
                                 border: state.diarrhea
                                     ? "5px ridge red"
                                     : state.pushAbility ? "5px ridge green" : "5px ridge #1f1f1f",
                             }}>
                            <img src={images.bomb} alt="supply"/>
                        </div>
                        <div className="value">
                            {state.currSupply}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}