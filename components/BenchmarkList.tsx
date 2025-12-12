import React from 'react';
import { formatPercentPoints } from '../utils/formatters.ts';

interface BenchmarkItem {
    title: string;
    delta_vs_benchmark_pp: number;
    focus_delta_pp: number;
    benchmark_delta_pp: number;
    confidence: 'hoch' | 'mittel' | 'niedrig' | string;
    evidence: any;
}

interface BenchmarkListProps {
    items: BenchmarkItem[];
}

const ConfidencePill: React.FC<{ confidence: string }> = ({ confidence }) => {
    const styles = {
        hoch: 'bg-green-100 text-green-800',
        mittel: 'bg-yellow-100 text-yellow-800',
        niedrig: 'bg-red-100 text-red-800',
    };
    const style = styles[confidence as keyof typeof styles] || 'bg-gray-100 text-gray-800';
    return (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style}`}>
            {confidence.charAt(0).toUpperCase() + confidence.slice(1)}
        </span>
    );
};

export const BenchmarkList: React.FC<BenchmarkListProps> = ({ items }) => {
    if (!items || items.length === 0) {
        return <p className="text-text-secondary">Keine signifikanten Abweichungen gefunden.</p>;
    }
    
    return (
        <div className="space-y-4">
            {items.map((item, index) => {
                const isPositive = item.delta_vs_benchmark_pp > 0;
                const barColor = isPositive ? 'bg-green-500' : 'bg-red-500';
                const maxWidth = Math.max(...items.map(i => Math.abs(i.delta_vs_benchmark_pp)), 1);
                const barWidth = (Math.abs(item.delta_vs_benchmark_pp) / maxWidth) * 100;
                
                return (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-sm text-text-primary flex-1">{item.title}</p>
                            <div className="w-40 ml-4 text-right">
                                <p className={`font-bold text-lg ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{formatPercentPoints(item.delta_vs_benchmark_pp / 100)}</p>
                                <p className="text-xs text-text-secondary">vs. Benchmark</p>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                             <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${barWidth}%` }}></div>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-xs text-text-secondary">
                            <div>
                                <span className="font-semibold">Fokus:</span> {formatPercentPoints(item.focus_delta_pp / 100)}
                                <span className="mx-2">|</span>
                                <span className="font-semibold">Benchmark:</span> {formatPercentPoints(item.benchmark_delta_pp / 100)}
                            </div>
                            <ConfidencePill confidence={item.confidence} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
