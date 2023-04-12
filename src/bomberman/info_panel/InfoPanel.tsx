import "./InfoPanel.scss";
import {IPlayerStats} from "../types";
import {useEffect, useRef} from "react";

function StateProp(props: { name: string, value: any }) {
    const value = useRef(null);

    useEffect(() => {
        if (value.current !== props.value)
            value.current = props.value;
    });

    return <div className="state-prop">
        <div>{props.name}</div>
        <div style={value.current === props.value ? {fontWeight: "inherit", color: "inherit"} : {fontWeight:  "bold", color: "lightgoldenrodyellow"}}>
            {typeof props.value === "number" ? props.value.toFixed(1) : JSON.stringify(props.value)}
        </div>
    </div>
}

export function InfoPanel(props: { stats: IPlayerStats }) {
    const parseObject = (obj: object) => {
        return Object.entries(obj).map(([key, value]) =>
            value instanceof Object
                ? <div className="state-prop" key={key}>
                    <div>{key}</div>
                    <div className={key}>{parseObject(value)}</div>
                </div>
                : <StateProp key={key} name={key} value={value}/>
        );
    }

    return (
        <div className="info-panel">
            <div className="player-stats">
                {parseObject(props.stats)}
            </div>
        </div>
    );
}