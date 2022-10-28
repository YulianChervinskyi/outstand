import React from "react";
import {Digit, ICalcProps, Operator} from "./types";
import {KeyBoard} from "./KeyBoard";

export function Calc(props: ICalcProps) {
    const data = JSON.parse(props.text || '{}');

    const [display, setDisplay] = React.useState<string>(data?.display || '0');
    const [register, setRegister] = React.useState<number | undefined>(data?.register);
    const [calcMode, setCalcMode] = React.useState<Operator | undefined>(data?.calcMode);
    const [resetDisplay, setResetDisplay] = React.useState<boolean>(data?.resetDisplay || false);

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

    const saveState = () => {
        const data = JSON.stringify({
            display,
            register,
            calcMode,
            resetDisplay,
        });

        if (props.text !== data)
            props.onChange({text: data});
    }

    React.useEffect(saveState, [display, register, calcMode, resetDisplay]);

    return (
        <div style={{
            width: props.width,
            height: props.height,
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
                        style={{
                            width: "100%",
                            height: "100%",
                            boxSizing: "border-box",
                            textAlign: "right",
                            fontSize: props.height * 0.1,
                        }}
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
