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
        if (!eyeLRef.current?.parentElement || !eyeRRef.current?.parentElement)
            return;

        const pupil = eyeLRef.current.getBoundingClientRect();

        const lEye = eyeLRef.current.parentElement.getBoundingClientRect();
        const lx = lEye.left + lEye.width / 2;
        const ly = lEye.top + lEye.height / 2;
        const lAngle = Math.atan2(e.clientY - ly, e.clientX - lx);

        const lRadiusX = Math.min(lEye.width / 2 - 0.8 * pupil.width, Math.abs(e.clientX - lx));
        const lRadiusY = Math.min(lEye.height / 2 - 0.8 * pupil.height, Math.abs(e.clientY - ly));
        setEyeLStyle({
            left: lEye.width / 2 + lRadiusX * Math.cos(lAngle),
            top: lEye.height / 2 + lRadiusY * Math.sin(lAngle)
        });

        const rEye = eyeRRef.current.parentElement.getBoundingClientRect();
        const rx = rEye.left + rEye.width / 2;
        const ry = rEye.top + rEye.height / 2;
        const rAngle = Math.atan2(e.clientY - ry, e.clientX - rx);

        const rRadiusX = Math.min(rEye.width / 2 - 0.8 * pupil.width, Math.abs(e.clientX - rx));
        const rRadiusY = Math.min(rEye.height / 2 - 0.8 * pupil.height, Math.abs(e.clientY - ry));
        setEyeRStyle({
            left: rEye.width / 2 + rRadiusX * Math.cos(rAngle),
            top: rEye.height / 2 + rRadiusY * Math.sin(rAngle)
        });
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