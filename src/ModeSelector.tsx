import {BoxType} from "./Box";
import {imagesPng} from "./icons/images";
import './ModeSelector.css';

export interface IModeSelectorProps {
    onSelectMode: (type: BoxType | undefined) => void,
    selected: BoxType | undefined,
}

export function ModeSelector(props: IModeSelectorProps) {
    const style = (value: BoxType) => {
        return value === props.selected ?
            {paddingBottom: "1%", filter: "none"} : {filter: "grayscale(100%)"};
    };

    const handleClick = (value: BoxType) => {
        if (value !== props.selected)
            props.onSelectMode(value);
        else
            props.onSelectMode(undefined);
    };

    return (
        <div className="mode-selector">
            {Object.values(BoxType).map((value, i) =>
                <img src={imagesPng[i]} alt="" style={style(value)} onClick={() => handleClick(value)}/>)}
        </div>
    );
}