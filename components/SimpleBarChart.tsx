import React from 'react';
import { formatNumber, formatPercent, formatPeriodLabel } from '../utils/formatters';

interface BarChartData {
    name: string;
    value: number;
    n?: number;
}

interface SimpleBarChartProps {
    data: BarChartData[];
    valueType: 'count' | 'share';
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, valueType }) => {
    if (!data || data.length === 0) {
        return <p className="text-text-secondary">Keine Daten verfügbar.</p>;
    }

    const maxValue = Math.max(...data.map(item => item.value), 0);
    const valueFormatter = valueType === 'share' ? formatPercent : formatNumber;

    return (
        <div className="w-full pt-4">
            <div className="flex justify-around items-end h-48 space-x-4">
                {data.map((item, index) => {
                    const barHeight = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                    const barColor = index === 0 ? 'bg-diagram-3' : 'bg-brand-orange';
                    return (
                        <div key={index} className="flex flex-col-reverse h-full flex-1 text-center">
                             <div className="text-xs text-text-secondary mt-2 font-semibold">
                                {formatPeriodLabel(item.name)}
                                {item.n !== undefined && (
                                    <span className="block font-normal">(n={item.n})</span>
                                )}
                             </div>
                             <div className="w-full flex-grow flex items-end justify-center">
                                <div
                                    className={`w-3/4 ${barColor} rounded-t-lg transition-all duration-500 ease-in-out`}
                                    style={{ height: `${barHeight}%` }}
                                    title={`${item.name}: ${valueFormatter(item.value)}`}
                                >
                                    &nbsp;
                                </div>
                             </div>
                             <div className="text-sm font-bold text-text-primary mb-1">{valueFormatter(item.value)}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};