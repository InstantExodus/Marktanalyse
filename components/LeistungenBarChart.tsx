import React from 'react';
import { formatPercent, formatPercentPoints } from '../utils/formatters.ts';

interface LeistungDataItem {
    label: string;
    value_pct: number;
    delta_pp: number;
    detail_current: string;
    detail_ref: string;
}

interface LeistungenBarChartProps {
    data: LeistungDataItem[];
}

export const LeistungenBarChart: React.FC<LeistungenBarChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-text-secondary">Keine Daten verfügbar.</p>;
    }
    
    const maxValue = Math.max(...data.map(item => item.value_pct), 0);
    
    return (
        <div className="space-y-4">
            {data.map((item) => {
                const barWidth = maxValue > 0 ? (item.value_pct / maxValue) * 100 : 0;
                const deltaColor = item.delta_pp > 0.1 ? 'text-green-600' : item.delta_pp < -0.1 ? 'text-red-600' : 'text-gray-500';
                
                return (
                    <div key={item.label} className="group" title={`${item.detail_current} (vs. ${item.detail_ref})`}>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium text-text-secondary truncate">{item.label}</p>
                            <div className="flex items-baseline">
                                <p className="text-sm font-bold text-text-primary">{formatPercent(item.value_pct / 100)}</p>
                                <p className={`text-xs font-semibold ml-2 ${deltaColor}`}>{formatPercentPoints(item.delta_pp / 100)}</p>
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
