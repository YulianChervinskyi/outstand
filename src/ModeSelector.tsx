import {BoxType} from "./Box";
import React from "react";
import './ModeSelector.css';

export interface IModeSelectorProps {
    onSelectMode: (type: BoxType) => void,
    selected: BoxType,
}

export function ModeSelector(props: IModeSelectorProps) {
    return (
        <div className="mode-selector">
            {Object.values(BoxType).map((value) =>
                <button
                    style={{borderColor: props.selected === value ? 'lightsalmon' : 'darkgray'}}
                    onClick={() => props.onSelectMode(value)}>
                    {value}
                </button>)}
        </div>
    );
}