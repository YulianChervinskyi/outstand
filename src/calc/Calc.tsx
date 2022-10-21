import React, {useState} from "react";
import {Digit, ICalcProps, Operator} from "./types";
import {KeyBoard} from "./KeyBoard";

export function Calc(props: ICalcProps) {
    const [value, setValue] = useState("0");
    const [prevValue, setPrevValue] = useState<number | undefined>(undefined);
    const [calcMode, setCalcMode] = useState<Operator | undefined>(undefined);

    const handlePressDigit = (digit: Digit) => {
        if (digit !== Digit.Dot)
            setValue(value === "0" && !calcMode || value === String(prevValue) ? digit : value.concat(digit));
        else if (value.indexOf(Digit.Dot) === -1)
            setValue(value + Digit.Dot);
    }

    const handlePressClear = (full?: boolean) => {
        if (full) {
            setValue(Digit.D0);
            handlePressOperator(undefined);
        } else {
            (value.length > 1 && value !== "NaN") ?
                setValue(value.slice(0, value.length - 1)) : setValue("0");
        }
    }

    const handlePressOperator = (mode: Operator | undefined) => {
        if (value !== String(prevValue) || !mode)
            setPrevValue(Number(value));

        mode === Operator.Equal ? setPrevValue(calc()) : setCalcMode(mode);
    }

    const calc = () => {
        let result = 0;
        switch (calcMode) {
            case Operator.Multiply:
                result = Number(prevValue) * Number(value);
                break;
            case Operator.Divide:
                result = Number(prevValue) / Number(value);
                break;
            case Operator.Plus:
                result = Number(prevValue) + Number(value);
                break;
            case Operator.Minus:
                result = Number(prevValue) - Number(value);
                break;
            case Operator.Mod:
                result = Number(prevValue) % Number(value);
                break;
        }
        value === String(prevValue) ? handlePressOperator(calcMode) : handlePressOperator(undefined);

        setValue(String(result));
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
