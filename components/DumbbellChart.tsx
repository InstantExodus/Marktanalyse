import React from 'react';
import { formatPercent } from '../utils/formatters.ts';

interface DumbbellDataItem {
    label: string;
    // Generic keys for any period comparison (YoY or QoQ)
    value_ref: number;     // e.g. Previous Year or Previous Quarter (0-100)
    value_current: number; // e.g. Current Year or Current Quarter (0-100)
    n_ref?: number;
    n_current?: number;
    
    // Legacy support (optional, can be removed if all JSONs are updated)
    ytd_2024_pct?: number;
    ytd_2025_pct?: number;
    n_2024?: number;
    n_2025?: number;
}

interface DumbbellChartProps {
    data: DumbbellDataItem[];
}

export const DumbbellChart: React.FC<DumbbellChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-text-secondary">Keine Daten verfügbar.</p>;
    }

    return (
        <div className="space-y-6">
            {data.map((item, index) => {
                // Support both new generic keys and old specific keys for backward compatibility
                const val1 = item.value_ref ?? item.ytd_2024_pct ?? 0;
                const val2 = item.value_current ?? item.ytd_2025_pct ?? 0;
                
                const n1 = item.n_ref ?? item.n_2024;
                const n2 = item.n_current ?? item.n_2025;

                const left = Math.min(val1, val2);
                const width = Math.abs(val1 - val2);
                const isIncrease = val2 > val1;

                return (
                    <div key={`${item.label}-${index}`}>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium text-text-primary">{item.label}</p>
                            <p className="text-xs text-text-secondary">
                                {formatPercent(val1 / 100)} → {formatPercent(val2 / 100)}
                            </p>
                        </div>
                        <div className="relative h-6 flex items-center">
                            {/* Base Line */}
                            <div className="absolute bg-gray-200 h-1 w-full rounded-full"></div>
                            {/* Range line (Delta) */}
                            <div
                                className={`absolute h-1 ${isIncrease ? 'bg-green-300' : 'bg-red-300'} rounded-full`}
                                style={{ left: `${left}%`, width: `${width}%` }}
                            ></div>
                            {/* Point 1 (Reference) */}
                            <div
                                className="absolute w-4 h-4 bg-diagram-3 rounded-full border-2 border-white shadow-sm"
                                style={{ left: `calc(${val1}% - 8px)` }}
                                title={`Referenz: ${formatPercent(val1 / 100)} ${n1 ? `(n=${n1})`: ''}`}
                            ></div>
                            {/* Point 2 (Current) */}
                             <div
                                className="absolute w-4 h-4 bg-brand-orange rounded-full border-2 border-white shadow-sm"
                                style={{ left: `calc(${val2}% - 8px)` }}
                                title={`Aktuell: ${formatPercent(val2 / 100)} ${n2 ? `(n=${n2})`: ''}`}
                            ></div>
                        </div>
                    </div>
                );
            })}
             <div className="flex justify-end space-x-4 pt-2 text-xs text-text-secondary">
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-diagram-3 mr-2"></div>Referenz</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-brand-orange mr-2"></div>Aktuell</div>
            </div>
        </div>
    );
};