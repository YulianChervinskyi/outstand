import {images} from "../assets";

export function Bomb() {
    const style = {
        filter: "hue-rotate(0deg)"
    };

    return <img className="bomb" style={style} src={images.bomb} alt="bomb"/>;
}