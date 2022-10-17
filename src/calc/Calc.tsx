import {useState} from "react";
import {KeyLayout} from "./KeyLayout";
import {Digit, ICalcProps, Operator} from "./types";

export function Calc(props: ICalcProps) {
    const [input, setInput] = useState("0");
    const [operator, setOperator] = useState<Operator | undefined>(undefined);
    const [operand, setOperand] = useState<number | undefined>(undefined);
    const [inputMode, setInputMode] = useState(true);

    const handlePressDigit = (digit: Digit) => {
        let prevInput = input;

        if (!inputMode) {
            prevInput = "0";
            setInputMode(true);
        }

        if (prevInput === "0" && digit !== Digit.Dot) {
            prevInput = "";
        } else if (prevInput.includes(".") && digit === Digit.Dot) {
            return;
        }

        setInput(prevInput + digit);
    }

    const handlePressOp = (op: Operator) => {
        if (inputMode || op === Operator.Equal)
            calculate();

        if (op !== Operator.Equal) {
            setOperand(Number(input));
            setOperator(op);
        }

        setInputMode(false);
    }

    const calculate = () => {
        let result = operand;
        let operand2 = Number(input);

        if (operator && result !== undefined) {
            switch (operator) {
                case Operator.Plus:
                    result += operand2;
                    break;
                case Operator.Minus:
                    result -= operand2;
                    break;
                case Operator.Multiply:
                    result *= operand2;
                    break;
                case Operator.Divide:
                    result /= operand2;
                    break;
                case Operator.Equal:
                    result = operand2;
                    break;
            }
            setInput(result.toString());
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
