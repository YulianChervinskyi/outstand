import React, {useState} from "react";
import {ICalcProps} from "./types";
import {KeyBoard} from "./KeyBoard";

export function Calc(props: ICalcProps) {
    const [value, setValue] = useState("0");
    const [prevValue, setPrevValue] = useState("0");
    const [calcMode, setCalcMode] = useState("");

    const handlePressDigit = (number: string) => {
        if (number === ".")
            addDot(number);
        else
            prevValue === value ? setValue(number) : setValue(value.concat(number));
    }

    const handleResetMode = (_value: string) => {
        setValue(_value);
        setPrevValue(_value);
        setCalcMode("");
    }

    const handlePressOperator = (mode: string) => {
        if (mode === "=")
            calc();

        if (!calcMode && value !== "0")
            setPrevValue(value);

        setCalcMode(mode);
    }

    const addDot = (dot: string) => {
        if (value.indexOf(".") !== -1)
            return;

        value ? setValue(value.concat(dot)) : setValue(value + dot);
    }

    const handlePressClear = () => {
        value.length > 1 && value !== "NaN" ?
            setValue(value.slice(0, value.length - 1)) : setValue("0");
    }

    const calc = () => {
        let result = "0";
        switch (calcMode) {
            case "*":
                result = String(Number(prevValue) * Number(value));
                break;
            case "/":
                result = String(Number(prevValue) / Number(value));
                break;
            case "+":
                result = String(Number(prevValue) + Number(value));
                break;
            case "-":
                result = String(Number(prevValue) - Number(value));
                break;
            case "%":
                result = String(Number(prevValue) % Number(value));
                break;
        }
        handleResetMode(result);
    }

    return (
        <div style={{
            width: props.width,
            height: props.height,
            background: "gray",
            padding: "5px"
        }}>
            <div style={{
                display: "flex",
                width: "100%",
                height: "100%",
                flexDirection: "column",
                alignItems: "stretch",
            }}>
                <div style={{height: "16.66%"}}>
                    <input
                        style={{width: "100%", height: "100%", boxSizing: "border-box", textAlign: "right"}}
                        type="text"
                        value={value}
                        onKeyDown={(e) => e.preventDefault()}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
                <KeyBoard
                    style={{height: "100%"}}
                    onPressDigit={handlePressDigit}
                    onPressOperator={handlePressOperator}
                    onPressClear={handlePressClear}
                    onResetMode={handleResetMode}
                />
            </div>
        </div>
    );
}
