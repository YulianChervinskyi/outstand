import {BoxType} from "./Box";
import React from "react";
import {iconsPng} from "./icons/images";
import './ModeSelector.css';

export interface IModeSelectorProps {
    onSelectMode: (type: BoxType | undefined, e: React.MouseEvent) => void,
    selected: BoxType | undefined,
}

export function ModeSelector(props: IModeSelectorProps) {
    const style = (value: BoxType) => {
        return value === props.selected ?
            {paddingBottom: "1%", filter: "none"} : {filter: "grayscale(100%)"};
    }

    const handleClick = (value: BoxType, e: React.MouseEvent) => {
        if (value !== props.selected)
            props.onSelectMode(value, e);
        else
            props.onSelectMode(undefined, e);
    }

    return (
        <div className="mode-selector">
            {Object.values(BoxType).map((value, key) =>
                <img src={iconsPng[value]}
                     alt=""
                     style={style(value)}
                     onClick={(e: React.MouseEvent) => handleClick(value, e)}
                     key={key}
                />)}
        </div>
    );
}