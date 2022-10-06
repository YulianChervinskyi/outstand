import React, {useState} from "react";
import './calc.css';

export function Calc() {
    const [value, setValue] = useState("");
    const [prevValue, setPrevValue] = useState("");
    const [calcMode, setCalcMode] = useState("");

    const addDigit = (number: string) => {
        prevValue === value ? setValue(number) : setValue(value.concat(number));
    }

    const addDot = (dot: string) => {
        if (value.indexOf(".") !== -1)
            return;

        value ? setValue(value.concat(dot)) : setValue("0" + dot);
    }

    const removeDigit = () => {
        setValue(value.slice(0, value.length - 1));
    }

    const resetMode = (s:string) => {
        setValue(s);
        setPrevValue(s);
        setCalcMode("");
    }

    const setMode = (mode: string) => {
        setPrevValue(value);
        setCalcMode(mode);
    }

    const calc = () => {
        let a = "";
        switch (calcMode) {
            case "*":
                a = String(Number(prevValue) * Number(value));
                break;
            case "/":
                a = String(Number(prevValue) / Number(value));
                break;
            case "+":
                a = String(Number(prevValue) + Number(value));
                break;
            case "-":
                a = String(Number(prevValue) - Number(value));
                break;
            case "%":
                a = String(Number(prevValue) % Number(value));
                break;
        }
        resetMode(a)
    }

    return (
        <div style={{background: "gray", width: "250px", height: "250px", padding: "5px"}}>
            <div className="main">
                <div style={{height: "16.66%"}}>
                    <input
                        style={{width: "100%", height: "100%", boxSizing: "border-box"}}
                        type="text"
                        onKeyDown={(e) => e.preventDefault()}
                        value={value}
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
                    <button onClick={() => setMode("%")}>%</button>
                </div>
                <div style={{height: "16.66%"}}>
                    {[4, 5, 6].map((i) =>
                        <button onClick={() => addDigit(String(i))}>{i}</button>)}
                    <button onClick={() => resetMode("")}>CE</button>
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
