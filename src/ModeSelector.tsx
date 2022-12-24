import {BoxType} from "./Box";
import './ModeSelector.css';
import {imagesPng} from "./icons/images";

export interface IModeSelectorProps {
    onSelectMode: (type: BoxType) => void,
    selected: BoxType,
}

export function ModeSelector(props: IModeSelectorProps) {
    const style = (value: BoxType) => {
        return value === props.selected ?
            {paddingBottom: "1%", filter: "none"} : {filter: "grayscale(100%)"};
    };

    return (
        <div className="mode-selector">
            {Object.values(BoxType).map((value, i) =>
                <img src={imagesPng[i]} alt="" style={style(value)} onClick={() => props.onSelectMode(value)}/>)}
        </div>
    );
}