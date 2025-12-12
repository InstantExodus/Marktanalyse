
import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    color?: 'gray' | 'orange';
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'gray' }) => {
    const colorClasses = {
        gray: 'bg-gray-100 text-gray-800',
        orange: 'bg-brand-orange/10 text-brand-orange',
    };

    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorClasses[color]}`}>
            {children}
        </span>
    );
};