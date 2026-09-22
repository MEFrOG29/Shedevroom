import React, { useState, useRef } from 'react';

interface TiltCardProps {
    children: React.ReactNode;
    className: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [transformStyle, setTransformStyle] = useState('');
    const [isLeaving, setIsLeaving] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;

        setIsLeaving(false);
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const maxRotation = 4;
        const rotateX = (-y / (rect.height / 2)) * maxRotation;
        const rotateY = (x / (rect.width / 2)) * maxRotation;

        setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`);
    };

    const handleMouseLeave = () => {
        setIsLeaving(true);
        setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: transformStyle,
                transformStyle: 'preserve-3d',
                transition: isLeaving ? 'transform 0.3s ease-out' : 'none',
            }}
            className={`${className} transform-gpu`}
        >
            {children}
        </div>
    );
};