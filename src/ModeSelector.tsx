import {BoxType} from "./Box";
import React, {useState} from "react";
import './ModeSelector.css';

export interface IModeSelectorProps {
    onSelectMode: (type: BoxType) => void,
    selected: BoxType,
}

export function ModeSelector(props: IModeSelectorProps) {
    const [btnDisplay, setBtnDisplay] = useState<boolean>(false);

    const btnStyle = (value: BoxType) => {
        return {
            transition: "0.66s",
            display: btnDisplay ? "inline-block" : "none",
            padding: value === props.selected ? "0 2% 2% 2%" : "",
        }
    };

    return (
        <div className="mode-selector" onMouseEnter={() => setBtnDisplay(true)} onMouseLeave={() => setBtnDisplay(false)}>
            {Object.values(BoxType).map((value) =>
                <button style={btnStyle(value)} onClick={() => props.onSelectMode(value)}>
                    {value}
                </button>)}
        </div>
    );
}