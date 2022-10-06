import React, {useState} from "react";
import './calc.css';

export function Calc() {
    const [value, setValue] = useState("");
    const [oldValue, setOldValue] = useState("");
    const [calcMode, setCalcMode] = useState("");

    const inputAddNumber = (number: string) => {
        oldValue === value ? setValue(number) : setValue(value.concat(number));
    }

    const inputAddDot = (dot: string) => {
        if (value.indexOf(".") !== -1)
            return;

        value ? setValue(value.concat(dot)) : setValue("0" + dot);
    }

    const inputRemoveNumber = () => {
        setValue(value.slice(0, value.length - 1));
    }

    const inputClear = () => {
        setValue("");
        setOldValue("");
        setCalcMode("");
    }

    const setMode = (mode: string) => {
        setOldValue(value);
        setCalcMode(mode);
    }

    const calc = () => {
        let a = "";
        switch (calcMode) {
            case "*":
                a = String(Number(oldValue) * Number(value));
                break;
            case "/":
                a = String(Number(oldValue) / Number(value));
                break;
            case "+":
                a = String(Number(oldValue) + Number(value));
                break;
            case "-":
                a = String(Number(oldValue) - Number(value));
                break;
            case "%":
                a = String(Number(oldValue) % Number(value));
                break;
        }
        setValue(a);
        setOldValue(a);
        setCalcMode("");
    }

    return (
        <div style={{background: "gray", width: "250px", height: "250px", padding: "5px"}}>
            <div className="main">
                <div style={{height: "16.66%"}}>
                    <input
                        style={{width: "100%", height: "100%", boxSizing: "border-box"}}
                        type="text"
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
                        <button onClick={() => inputAddNumber(String(i))}>{i}</button>)}
                    <button onClick={() => setMode("%")}>%</button>
                </div>
                <div style={{height: "16.66%"}}>
                    {[4, 5, 6].map((i) =>
                        <button onClick={() => inputAddNumber(String(i))}>{i}</button>)}
                    <button onClick={() => inputClear()}>CE</button>
                </div>
                <div style={{height: "16.66%"}}>
                    {[1, 2, 3].map((i) =>
                        <button onClick={() => inputAddNumber(String(i))}>{i}</button>)}
                    <button onClick={() => inputRemoveNumber()}>C</button>
                </div>
                <div style={{flexDirection: "row", height: "16.66%"}}>
                    <button style={{width: "50%"}} onClick={() => inputAddNumber("0")}>0</button>
                    <button onClick={() => inputAddDot(".")}>.</button>
                    <button onClick={() => calc()}>=</button>
                </div>
            </div>
        </div>
    );
}