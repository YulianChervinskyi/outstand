import {Digit, IKeyBoardProps, Operator} from "./types";

export function KeyBoard(props: IKeyBoardProps) {
    return (
        <div style={props.style}>
            <div style={{height: "20%"}}>
                <button onClick={() => props.onPressOperator(Operator.Multiply)} style={{width: "25%", height: "100%"}}>{Operator.Multiply}</button>
                <button onClick={() => props.onPressOperator(Operator.Divide)} style={{width: "25%", height: "100%"}}>{Operator.Divide}</button>
                <button onClick={() => props.onPressOperator(Operator.Plus)} style={{width: "25%", height: "100%"}}>{Operator.Plus}</button>
                <button onClick={() => props.onPressOperator(Operator.Minus)} style={{width: "25%", height: "100%"}}>{Operator.Minus}</button>
            </div>
            <div style={{height: "20%"}}>
                {[Digit.D7, Digit.D8, Digit.D9].map((i) =>
                    <button onClick={() => props.onPressDigit(i)} style={{width: "25%", height: "100%"}}>{i}</button>)}
                <button onClick={() => props.onPressOperator(Operator.Mod)} style={{width: "25%", height: "100%"}}>{Operator.Mod}</button>
            </div>
            <div style={{height: "20%"}}>
                {[Digit.D4, Digit.D5, Digit.D6].map((i) =>
                    <button onClick={() => props.onPressDigit(i)} style={{width: "25%", height: "100%"}}>{i}</button>)}
                <button onClick={() => props.onResetMode(Digit.D0)} style={{width: "25%", height: "100%"}}>CE</button>
            </div>
            <div style={{height: "20%"}}>
                {[Digit.D1, Digit.D2, Digit.D3].map((i) =>
                    <button onClick={() => props.onPressDigit(i)} style={{width: "25%", height: "100%"}}>{i}</button>)}
                <button onClick={() => props.onPressClear()} style={{width: "25%", height: "100%"}}>C</button>
            </div>
            <div style={{flexDirection: "row", height: "20%"}}>
                <button onClick={() => props.onPressDigit(Digit.D0)} style={{width: "50%", height: "100%"}}>{Digit.D0}</button>
                <button onClick={() => props.onPressDigit(Digit.Dot)} style={{width: "25%", height: "100%"}}>{Digit.Dot}</button>
                <button onClick={() => props.onPressOperator(Operator.Equal)} style={{width: "25%", height: "100%"}}>{Operator.Equal}</button>
            </div>
        </div>
    );
}