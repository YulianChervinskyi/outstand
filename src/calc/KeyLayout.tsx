import React from "react";
import {Digit, IKeyLayoutProps, Operator} from "./types";

export function KeyLayout(props: IKeyLayoutProps) {
    return (
        <div style={props.style}>
            <div style={{display: "flex", flexDirection: "row", height: "20%"}}>
                <button style={{width: "25%"}} onClick={props.onPressClear}>C</button>
                <button style={{width: "25%"}} onClick={() => props.onPressOperator(Operator.Divide)}>/</button>
                <button style={{width: "25%"}} onClick={() => props.onPressOperator(Operator.Multiply)}>*</button>
                <button style={{width: "25%"}} onClick={() => props.onPressOperator(Operator.Minus)}>-</button>
            </div>

            <div style={{display: "flex", flexDirection: "row", height: "40%"}}>
                <div style={{display: "flex", flexDirection: "column", width: "75%", justifyContent: "space-evenly"}}>
                    <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
                        {[Digit.D7, Digit.D8, Digit.D9].map((d) =>
                            <button style={{width: "33.33%"}} onClick={() => props.onPressDigit(d)}>{d}</button>)}
                    </div>
                    <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
                        {[Digit.D4, Digit.D5, Digit.D6].map((d) =>
                            <button style={{width: "33.33%"}} onClick={() => props.onPressDigit(d)}>{d}</button>)}
                    </div>
                </div>
                <button style={{width: "25%"}} onClick={() => props.onPressOperator(Operator.Plus)}>+</button>
            </div>

            <div style={{display: "flex", flexDirection: "row", height: "40%"}}>
                <div style={{display: "flex", flexDirection: "column", width: "75%", justifyContent: "space-evenly"}}>
                    <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
                        {[Digit.D1, Digit.D2, Digit.D3].map((d) =>
                            <button style={{width: "33.33%"}} onClick={() => props.onPressDigit(d)}>{d}</button>)}
                    </div>
                    <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
                        <button style={{width: "66.66%"}} onClick={() => props.onPressDigit(Digit.D0)}>0</button>
                        <button style={{width: "33.33%"}} onClick={() => props.onPressDigit(Digit.Dot)}>.</button>
                    </div>
                </div>
                <button style={{width: "25%"}} onClick={() => props.onPressOperator(Operator.Equal)}>=</button>
            </div>
        </div>
    );
}
