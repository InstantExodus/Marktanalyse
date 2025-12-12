
import React from 'react';

interface CardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
    return (
        <div className={`bg-white p-6 rounded-xl shadow-md ${className}`}>
            <h3 className="text-xl font-bold text-brand-dark-gray mb-4">{title}</h3>
            {children}
        </div>
    );
};