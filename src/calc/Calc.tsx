import React, {useState} from "react";
import {Digit, ICalcProps, Operator} from "./types";
import {KeyBoard} from "./KeyBoard";

export function Calc(props: ICalcProps) {
    const [display, setDisplay] = useState("0");
    const [register, setRegister] = useState<number | undefined>(undefined);
    const [calcMode, setCalcMode] = useState<Operator | undefined>(undefined);
    const [resetDisplay, setResetDisplay] = useState(false);

    const handlePressDigit = (digit: Digit) => {
        if (digit !== Digit.Dot)
            setDisplay(display === "0" || resetDisplay ? digit : display + digit);
        else if (display.indexOf(Digit.Dot) === -1 || resetDisplay)
            setDisplay(resetDisplay ? Digit.D0 + digit : display + digit);

        setResetDisplay(false);
    }

    const handlePressClear = (full?: boolean) => {
        if (full)
            resetStates();
        else
            setDisplay(display.length > 1 && display !== "NaN" ? display.slice(0, display.length - 1) : Digit.D0);
    }

    const handlePressOperator = (mode: Operator) => {
        if (mode !== Operator.Equal)
            setCalcMode(mode);

        setRegister(mode === Operator.Equal ? calc() : Number(display));
        setResetDisplay(true);
    }

    const resetStates = () => {
        setDisplay(Digit.D0);
        setRegister(undefined);
        setCalcMode(undefined);
    }

    const calc = () => {
        if (!register)
            return undefined;

        let result = register;
        switch (calcMode) {
            case Operator.Multiply:
                result *= Number(display);
                break;
            case Operator.Divide:
                result /= Number(display);
                break;
            case Operator.Plus:
                result += Number(display);
                break;
            case Operator.Minus:
                result -= Number(display);
                break;
            case Operator.Mod:
                result %= Number(display);
                break;
        }
        setDisplay(result.toString());
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
                        value={display}
                        onKeyDown={(e) => e.preventDefault()}
                        onChange={(e) => setDisplay(e.target.value)}
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
