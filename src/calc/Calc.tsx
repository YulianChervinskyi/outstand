import {useState} from "react";
import {KeyLayout} from "./KeyLayout";
import {Digit, ICalcProps, Operator} from "./types";

export function Calc(props: ICalcProps) {
    const [input, setInput] = useState("0");
    const [operator, setOperator] = useState<Operator | undefined>(undefined);
    const [operand, setOperand] = useState<number | undefined>(undefined);

    const handlePressDigit = (digit: Digit) => {
        let prevInput = input;

        if (operator && !operand) {
            setOperand(Number(input));
            prevInput = "0";
        }

        if (prevInput === "0" && digit !== Digit.Dot) {
            prevInput = "";
        } else if (prevInput.includes(".") && digit === Digit.Dot) {
            return;
        }

        setInput(prevInput + digit);
    }

    const handlePressOp = (op: Operator) => {
        calculate();
        setOperator(op);
    }

    const calculate = () => {
        let value = Number(input);
        if (operator && operand !== undefined) {
            switch (operator) {
                case Operator.Plus:
                    value = operand + value;
                    break;
                case Operator.Minus:
                    value = operand - value;
                    break;
                case Operator.Multiply:
                    value = operand * value;
                    break;
                case Operator.Divide:
                    value = operand / value;
                    break;
            }
            setInput(value.toString());
            setOperator(undefined);
            setOperand(undefined);
        }
    }

    const handlePressClear = () => {
        setOperand(undefined);
        setOperator(undefined);
        setInput("0");
    }


    return (
        <div style={{
            width: props.width,
            height: props.height,
            padding: "5px",
            border: "solid 1px black",
            borderRadius: "4px",
            display: "flex",
            flexDirection: "column",
        }}>
            <div style={{width: "100%"}}>
                <input
                    style={{
                        width: "100%",
                        fontSize: props.height * 0.15,
                        marginBottom: "2%",
                        boxSizing: "border-box",
                        textAlign: "right",
                        fontFamily: "monospace",
                    }}
                    value={input}
                    onChange={() => setInput(input)}
                />
            </div>

            <KeyLayout
                style={{flexGrow: 1}}
                onPressDigit={handlePressDigit}
                onPressOperator={handlePressOp}
                onPressClear={handlePressClear}
            />
        </div>
    );
}
