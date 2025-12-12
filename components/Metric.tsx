import React from 'react';
import { formatPercentPoints, formatPercent } from '../utils/formatters';
import type { DeltaView } from '../hooks/useData';

interface MetricProps {
    label: string;
    value: string | number;
    delta?: number;
    deltaType?: 'pp' | 'percent';
    tooltip?: string;
    valueFirst?: boolean;
    deltaView?: DeltaView;
}

export const Metric: React.FC<MetricProps> = ({ label, value, delta, deltaType = 'pp', tooltip, valueFirst = false, deltaView }) => {
    const renderDelta = () => {
        if (delta === undefined || delta === null || isNaN(delta)) return null;

        const isPositive = delta > 0;
        const color = isPositive ? 'text-green-600' : 'text-red-600';
        const formattedDelta = deltaType === 'pp' ? formatPercentPoints(delta) : formatPercent(delta);
        
        if (deltaType === 'pp' && Math.abs(delta) < 0.0001) return null;
        if (formattedDelta === '-') return null;

        const deltaLabel = deltaView ? ` ${deltaView}` : '';
        const deltaContent = `${formattedDelta}${deltaLabel}`;

        return (
            <span className={`text-sm font-semibold ml-2 ${color}`}>
                {deltaContent}
            </span>
        );
    };

    const content = (
        <>
            <div className={`flex ${valueFirst ? 'flex-row items-baseline' : 'flex-col'}`}>
                {!valueFirst && <p className="text-sm text-gray-500">{label}</p>}
                <p className={`font-bold ${valueFirst ? 'text-lg text-brand-dark-gray' : 'text-3xl text-brand-dark-gray'}`}>
                    {value}
                </p>
            </div>
            {renderDelta()}
        </>
    );

    return (
        <div className="relative" title={tooltip}>
             <div className={`flex items-baseline ${valueFirst ? 'justify-end' : ''}`}>
                 {content}
             </div>
        </div>
    );
};