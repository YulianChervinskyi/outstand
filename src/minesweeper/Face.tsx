import {EDifficultyType} from "./config";
import "./Face.css";
import React, {useEffect, useRef, useState} from "react";

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

    const handleMouseMove = (e: MouseEvent) => {
        if (!eyeLRef.current || !eyeRRef.current)
            return;

        const lX = eyeLRef.current?.offsetLeft;
        const lY = eyeLRef.current?.offsetTop;

        const {left, top, width, height} = eyeLRef.current?.getBoundingClientRect();
        console.log(left, top, e.clientX, e.clientY);

        const lAngle = Math.atan2(e.clientY - top, e.clientX - left) * 180 / Math.PI;
        console.log(lAngle);
    }

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="face-shape rounded"
             style={{backgroundColor: props.background}}
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