import {BoxType} from "./Box";
import React, {useState} from "react";
import './ModeSelector.css';

export interface IModeSelectorProps {
    onSelectMode: (type: BoxType) => void,
    selected: BoxType,
}

export function ModeSelector(props: IModeSelectorProps) {
    const [btnDisplay, setBtnDisplay] = useState<boolean>(false);

    // const handleClick = (value: BoxType) => {
    //     props.onSelectMode(value);
    //     setStyle({
    //         filter: props.selected === value ? "none" : "grayscale(100%)",
    //     });
    // }

    return (
        <div className="mode-selector"
             onMouseEnter={() => setBtnDisplay(true)}
             onMouseLeave={() => setBtnDisplay(false)}>
            {Object.values(BoxType).map((value) =>
                <button
                    style={{filter: props.selected === value ? "none" : "grayscale(100%)",
                        display: btnDisplay ? "inline-block" : "none"}}
                    onClick={() => props.onSelectMode(value)}>
                    {value}
                </button>)}
        </div>
    );
}