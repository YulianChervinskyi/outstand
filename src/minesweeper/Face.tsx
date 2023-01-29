import {EDifficultyType} from "./config";
import "./Face.css";
import React, {useRef, useState} from "react";

export interface IFaceProps {
    background: string,
    difficulty: EDifficultyType,
    giveDifficulty: (diff: EDifficultyType) => void,
}

export function Face(props: IFaceProps) {
    const [eyeLStyle, setEyeLStyle] = useState<{}>({});
    const [eyeRStyle, setEyeRStyle] = useState<{}>({});

    const eyeLRef = useRef<HTMLDivElement | null>(null);
    const eyeRRef = useRef<HTMLDivElement | null>(null);

    const handleMouseMove = () => {
        document.body.onmousemove = (e: MouseEvent) => {
            if (!eyeLRef.current || !eyeRRef.current)
                return;

            const lX = eyeLRef.current?.offsetLeft;
            const lY = eyeLRef.current?.offsetTop;

            const lAngle = Math.atan2(e.clientY - lY, e.clientX - lX) * 180 / Math.PI;

            // setEyeLStyle({left: lX + Math.cos(lAngle), top: lY + Math.sin(lAngle)});
            // setEyeLStyle({left: lX, top: lY})
            console.log(lX, lY);
            document.body.onmousemove = () => {};
        }
    }

    return (
        <div className="face-shape rounded"
             style={{backgroundColor: props.background}}
             onMouseMove={handleMouseMove}
             onClick={() => props.giveDifficulty(props.difficulty)}>
            <div className="half-face center-elements">
                <div className="sclera rounded">
                    <div className="pupil rounded" ref={eyeLRef} style={eyeLStyle}/>
                </div>
                <div className="sclera rounded">
                    <div className="pupil rounded" ref={eyeRRef} style={eyeRStyle}/>
                </div>
            </div>
            <div className="half-face center-elements">
                <div className="mouth"/>
            </div>
        </div>
    );
}