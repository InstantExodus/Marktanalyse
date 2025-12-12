import React from 'react';
import { formatPercent, formatPercentPoints } from '../utils/formatters';

export interface BarChartDataItem {
    name: string;
    value: number;
    delta: number;
}

interface HorizontalBarChartProps {
    data: BarChartDataItem[];
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-text-secondary">Keine Daten verfügbar.</p>;
    }

    const maxValue = Math.max(...data.map(item => item.value), 0);

    return (
        <div className="space-y-4">
            {data.map(item => {
                const barWidth = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                const deltaColor = item.delta > 0.001 ? 'bg-green-100 text-green-800' : item.delta < -0.001 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800';
                const formattedDelta = formatPercentPoints(item.delta);

                return (
                    <div key={item.name} className="group">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium text-text-secondary truncate" title={item.name}>{item.name}</p>
                            <div className="flex items-baseline">
                                <p className="text-sm font-bold text-text-primary">{formatPercent(item.value)}</p>
                                {formattedDelta !== '-' && (
                                     <span className={`text-xs font-bold ml-2 px-2 py-0.5 rounded-full ${deltaColor}`}>
                                        {formattedDelta}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                                className="bg-brand-orange h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${barWidth}%` }}
                            ></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};