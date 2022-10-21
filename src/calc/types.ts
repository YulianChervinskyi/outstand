export enum Digit {
    D0 = "0",
    D1 = "1",
    D2 = "2",
    D3 = "3",
    D4 = "4",
    D5 = "5",
    D6 = "6",
    D7 = "7",
    D8 = "8",
    D9 = "9",
    Dot = ".",
}

export enum Operator {
    Plus = "+",
    Minus = "-",
    Multiply = "*",
    Divide = "/",
    Equal = "=",
    Mod = "%",
}

export interface IKeyBoardProps {
    onPressDigit: (digit: Digit) => void,
    onPressOperator: (op: Operator) => void,
    onPressClear: (full?: boolean) => void,
    style?: React.CSSProperties,
}

export interface ICalcProps {
    width: number,
    height: number,
}
