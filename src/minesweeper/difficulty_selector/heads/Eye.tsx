import React, {useEffect, useRef, useState} from "react";
import "./Head.scss";

export function Eye() {
    const [eyeStyle, setEyeStyle] = useState({});

    const eyeRef = useRef<HTMLDivElement | null>(null);

    const handleMouseMove = (e: MouseEvent) => {
        if (!eyeRef.current?.parentElement)
            return;

        const pupil = eyeRef.current.getBoundingClientRect();

        const eye = eyeRef.current.parentElement.getBoundingClientRect();
        const x = eye.left + eye.width / 2;
        const y = eye.top + eye.height / 2;
        const angle = Math.atan2(e.clientY - y, e.clientX - x);

        const radiusX = Math.min(eye.width / 2 - 0.8 * pupil.width, Math.abs(e.clientX - x));
        const radiusY = Math.min(eye.height / 2 - 0.8 * pupil.height, Math.abs(e.clientY - y));
        setEyeStyle({
            left: eye.width / 2 + radiusX * Math.cos(angle),
            top: eye.height / 2 + radiusY * Math.sin(angle)
        });
    }

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="sclera rounded">
            <div className="pupil rounded" ref={eyeRef} style={eyeStyle}/>
        </div>
    );
}