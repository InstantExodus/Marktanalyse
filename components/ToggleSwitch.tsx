import React from 'react';

interface ToggleSwitchProps<T extends string> {
    label: string;
    option1: T;
    option2: T;
    option1Label: string;
    option2Label: string;
    selected: T;
    setSelected: (value: T) => void;
}

export const ToggleSwitch = <T extends string,>({ label, option1, option2, option1Label, option2Label, selected, setSelected }: ToggleSwitchProps<T>) => {
    return (
        <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-text-secondary">{label}</span>
            <div className="flex items-center bg-gray-200 rounded-full p-1">
                <button
                    onClick={() => setSelected(option1)}
                    className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors duration-300 ${selected === option1 ? 'bg-white text-brand-orange shadow-sm' : 'text-text-secondary hover:bg-gray-300'}`}
                    aria-pressed={selected === option1}
                >
                    {option1Label}
                </button>
                <button
                    onClick={() => setSelected(option2)}
                    className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors duration-300 ${selected === option2 ? 'bg-white text-brand-orange shadow-sm' : 'text-text-secondary hover:bg-gray-300'}`}
                     aria-pressed={selected === option2}
                >
                    {option2Label}
                </button>
            </div>
        </div>
    );
};