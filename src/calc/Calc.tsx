import {useState} from "react";
import {KeyLayout} from "./KeyLayout";
import {Digit, ICalcProps, Operator} from "./types";

export function Calc(props: ICalcProps) {
    const [value, setValue] = useState(0);
    const [operator, setOperator] = useState<Operator | undefined>(undefined);
    const [operand, setOperand] = useState<number | undefined>(undefined);

    const handlePressDigit = (digit: Digit) => {
        let strValue = value.toString();

        if (operator && !operand) {
            setOperand(value);
            strValue = "";
        }
        setValue(Number(strValue + digit));
    }

    const handlePressOp = (op: Operator) => {
        if (op === Operator.Equal)
            return handlePressEqual();

        setOperator(op);
    }

    const handlePressEqual = () => {
        if (operator && operand) {
            switch (operator) {
                case Operator.Plus:
                    setValue(operand + value);
                    break;
                case Operator.Minus:
                    setValue(operand - value);
                    break;
                case Operator.Multiply:
                    setValue(operand * value);
                    break;
                case Operator.Divide:
                    setValue(operand / value);
                    break;
            }
            setOperator(undefined);
            setOperand(undefined);
        }
    }

    const handlePressClear = () => {
        setValue(0);
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
                    value={value}
                    onChange={() => setValue(value)}
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
