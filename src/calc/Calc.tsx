import React, {useState} from "react";
import {Digit, ICalcProps, Operator} from "./types";
import {KeyBoard} from "./KeyBoard";

export function Calc(props: ICalcProps) {
    const [value, setValue] = useState("0");
    const [prevValue, setPrevValue] = useState<string | undefined>(undefined);
    const [calcMode, setCalcMode] = useState<Operator | undefined>(undefined);

    const handlePressDigit = (digit: Digit) => {
        if (digit !== Digit.Dot)
            setValue(value === "0" || value === prevValue ? digit : value + digit);
        else if (value.indexOf(Digit.Dot) === -1)
            setValue(value === prevValue || !prevValue && !calcMode ? Digit.D0 + digit : value + digit);
    }

    const handlePressClear = (full?: boolean) => {
        if (full)
            resetStates();
        else
            setValue(value.length > 1 && value !== "NaN" ? value.slice(0, value.length - 1) : Digit.D0);
    }

    const handlePressOperator = (mode: Operator) => {
        setCalcMode(mode);
        setPrevValue(mode === Operator.Equal ? calc() : value);
    }

    const resetStates = () => {
        setValue(Digit.D0);
        setPrevValue(undefined);
        setCalcMode(undefined);
    }

    const calc = () => {
        let result = "0";
        switch (calcMode) {
            case Operator.Multiply:
                setValue(result = String(Number(prevValue) * Number(value)));
                break;
            case Operator.Divide:
                setValue(result = String(Number(prevValue) / Number(value)));
                break;
            case Operator.Plus:
                setValue(result = String(Number(prevValue) + Number(value)));
                break;
            case Operator.Minus:
                setValue(result = String(Number(prevValue) - Number(value)));
                break;
            case Operator.Mod:
                setValue(result = String(Number(prevValue) % Number(value)));
                break;
        }
        return result;
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
                />
            </div>
        </div>
    );
}
