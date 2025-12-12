import React from 'react';

interface TabProps {
    name: string;
    isActive: boolean;
    onClick: () => void;
}

export const Tab: React.FC<TabProps> = ({ name, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2
                ${
                    isActive
                        ? 'bg-white text-text-primary shadow-sm border border-brand-orange/20'
                        : 'text-text-secondary hover:text-text-primary'
                }`
            }
        >
            {name}
        </button>
    );
};