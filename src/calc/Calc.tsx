import React, {useState} from "react";
import './calc.css';

export function Calc() {
    const [value, setValue] = useState("0");
    const [prevValue, setPrevValue] = useState("0");
    const [calcMode, setCalcMode] = useState("");

    const addDigit = (number: string) => {
        prevValue === value ? setValue(number) : setValue(value.concat(number));
    }

    const resetMode = (_value: string) => {
        setValue(_value);
        setPrevValue(_value);
        setCalcMode("");
    }

    const setMode = (mode: string) => {
        if (!calcMode && value !== "0")
            setPrevValue(value);

        setCalcMode(mode);
    }

    const addDot = (dot: string) => {
        if (value.indexOf(".") !== -1)
            return;

        value ? setValue(value.concat(dot)) : setValue(value + dot);
    }

    const removeDigit = () => {
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
        resetMode(result);
    }

    return (
        <div style={{background: "gray", width: "250px", height: "250px", padding: "5px"}}>
            <div className="main">
                <div style={{height: "16.66%"}}>
                    <input
                        style={{width: "100%", height: "100%", boxSizing: "border-box", textAlign: "right"}}
                        type="text"
                        value={value}
                        onKeyDown={(e) => e.preventDefault()}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
                <div style={{height: "16.66%"}}>
                    <button onClick={() => setMode("*")}>*</button>
                    <button onClick={() => setMode("/")}>/</button>
                    <button onClick={() => setMode("+")}>+</button>
                    <button onClick={() => setMode("-")}>-</button>
                </div>
                <div style={{height: "16.66%"}}>
                    {[7, 8, 9].map((i) =>
                        <button onClick={() => addDigit(String(i))}>{i}</button>)}
                    <button onClick={() => setMode("%")}>mod</button>
                </div>
                <div style={{height: "16.66%"}}>
                    {[4, 5, 6].map((i) =>
                        <button onClick={() => addDigit(String(i))}>{i}</button>)}
                    <button onClick={() => resetMode("0")}>CE</button>
                </div>
                <div style={{height: "16.66%"}}>
                    {[1, 2, 3].map((i) =>
                        <button onClick={() => addDigit(String(i))}>{i}</button>)}
                    <button onClick={() => removeDigit()}>C</button>
                </div>
                <div style={{flexDirection: "row", height: "16.66%"}}>
                    <button style={{width: "50%"}} onClick={() => addDigit("0")}>0</button>
                    <button onClick={() => addDot(".")}>.</button>
                    <button onClick={() => calc()}>=</button>
                </div>
            </div>
        </div>
    );
}
