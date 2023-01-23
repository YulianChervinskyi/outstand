import React from "react";
import {IComponentProps} from "../Box";
import {KeyLayout} from "./KeyLayout";
import {Digit, Operator} from "./types";

export function Calc(props: IComponentProps) {
    const data = JSON.parse(props.text || '{}');

    const [input, setInput] = React.useState<string>(data?.input || '0');
    const [operator, setOperator] = React.useState<Operator | undefined>(data?.operator);
    const [operand, setOperand] = React.useState<number | undefined>(data?.operand);
    const [inputMode, setInputMode] = React.useState<boolean>(data?.inputMode || true);

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

    const handlePressBackspace = () => {
        if (input.length > 1) {
            setInput(input.slice(0, -1));
        } else {
            setInput("0");
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Backspace") {
            handlePressBackspace();
        } else if (event.key === "Enter") {
            handlePressOp(Operator.Equal);
        } else if (event.key === "Escape") {
            handlePressClear();
        } else if (event.key >= "0" && event.key <= "9" || event.key === ".") {
            handlePressDigit(event.key as Digit);
        } else if (event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/") {
            handlePressOp(event.key as Operator);
        }
        event.preventDefault();
    }

    const saveState = () => {
        const data = JSON.stringify({
            input,
            operator,
            operand,
            inputMode,
        });

        if (props.text !== data)
            props.onChange({text: data});
    }

    React.useEffect(saveState, [input, operator, operand, inputMode]);

    return (
        <div
            className="Calc"
            style={{
                width: props.width,
                height: props.height,
                display: "flex",
                flexDirection: "column",
            }}
            onKeyDown={handleKeyDown}
        >
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
