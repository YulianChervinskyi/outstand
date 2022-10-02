import {useState} from "react";

interface ICalcProps {
    width: number,
    height: number,
}

export function Calc(props: ICalcProps) {
    const [value, setValue] = useState(0);

    const handlePressDigit = (digit: number) => {
        console.log("digit:", digit);
    }

    const handlePressOp = (op: "+" | "-" | "/" | "*") => {
        console.log("op:", op);
    }

    const handlePressDot = () => {
        console.log("dot pressed");
    }

    const handlePressResult = () => {
        console.log("result pressed");
    }

    const handlePressClear = () => {
        console.log("clear pressed");
    }

    return (
        <div style={{
            width: props.width,
            height: props.height,
            padding: "5px",
            border: "solid 1px black",
            borderRadius: "4px"
        }}>
            <div style={{width: "100%"}}>
                <input
                    style={{width: "100%", fontSize: props.height * 0.13, marginBottom: "2%", boxSizing: "border-box"}}
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                />
            </div>

            <div style={{display: "flex", flexDirection: "row", height: "16.5%"}}>
                <button style={{width: "25%"}} onClick={() => handlePressClear()}>C</button>
                <button style={{width: "25%"}} onClick={() => handlePressOp("/")}>/</button>
                <button style={{width: "25%"}} onClick={() => handlePressOp("*")}>*</button>
                <button style={{width: "25%"}} onClick={() => handlePressOp("-")}>-</button>
            </div>

            <div style={{display: "flex", flexDirection: "row", height: "33%"}}>
                <div style={{display: "flex", flexDirection: "column", width: "75%", justifyContent: "space-evenly"}}>
                    <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
                        {[7, 8, 9].map((n) => <button style={{width: "33.33%"}}
                                                      onClick={() => handlePressDigit(n)}>{n}</button>)}
                    </div>
                    <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
                        {[4, 5, 6].map((n) => <button style={{width: "33.33%"}}
                                                      onClick={() => handlePressDigit(n)}>{n}</button>)}
                    </div>
                </div>
                <button style={{width: "25%"}} onClick={() => console.log("+")}>+</button>
            </div>

            <div style={{display: "flex", flexDirection: "row", height: "33%"}}>
                <div style={{display: "flex", flexDirection: "column", width: "75%", justifyContent: "space-evenly"}}>
                    <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
                        {[1, 2, 3].map((n) => <button style={{width: "33.33%"}}
                                                      onClick={() => handlePressDigit(n)}>{n}</button>)}
                    </div>
                    <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
                        <button style={{width: "66.66%"}} onClick={() => handlePressDigit(0)}>{0}</button>
                        <button style={{width: "33.33%"}} onClick={() => handlePressDot()}>.</button>
                    </div>
                </div>
                <button style={{width: "25%"}} onClick={() => handlePressResult()}>=</button>
            </div>
        </div>
    );
}
