import {BoxType} from "./Box";
import React from "react";

export interface IModeSelectorProps {
    onSelectMode: (type: BoxType) => void,
}

export function ModeSelector(props: IModeSelectorProps) {
    return (
        <div>
            {Object.values(BoxType).map((value) =>
                <button onClick={() => props.onSelectMode(value)}>{value}</button>)}
        </div>
    );
}