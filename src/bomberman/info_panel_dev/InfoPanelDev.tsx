import {useEffect, useRef} from "react";
import "./InfoPanelDev.scss";

function StateProp(props: { name: string, value: any }) {
    const value = useRef<any>(props.value);
    const activeUntil = useRef<number>(0);

    useEffect(() => {
        if (value.current === props.value)
            return;

        value.current = props.value;
        activeUntil.current = Date.now() + 1000;
    });

    const style = activeUntil.current > Date.now()
        ? {fontWeight: "bold", color: "lightgoldenrodyellow"}
        : {fontWeight: "inherit", color: "inherit"};

    return (
        <div className="state-prop">
            <div>{props.name}</div>
            <div style={style}>
                {typeof props.value === "number" ? props.value.toFixed(1) : JSON.stringify(props.value)}
            </div>
        </div>
    );
}

export function InfoPanelDev(props: { stats: object }) {
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
        <div className="info-panel-dev">
            <div className="player-stats">
                {parseObject(props.stats)}
            </div>
        </div>
    );
}