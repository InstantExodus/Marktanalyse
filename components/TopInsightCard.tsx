import React, { useState } from 'react';
import type { TopInsight, DeltaView } from '../types.ts';
import { formatPercent, formatPercentPoints, formatCurrency, formatNumber } from '../utils/formatters.ts';
import { LeistungenBarChart } from './LeistungenBarChart.tsx';
import { BenchmarkList } from './BenchmarkList.tsx';
import { DumbbellChart } from './DumbbellChart.tsx';
import { SimpleBarChart } from './SimpleBarChart.tsx';

// --- HELPER FUNCTIONS ---

const getFormattedValue = (insight: TopInsight): string => {
    switch (insight.valueType) {
        case 'share': return formatPercent(insight.value);
        case 'currency': return formatCurrency(insight.value);
        case 'count': return formatNumber(insight.value);
        default: return String(insight.value);
    }
};

const getFormattedDelta = (insight: TopInsight): string => {
    if (insight.delta === undefined || insight.delta === null) return '-';
    switch (insight.deltaType) {
        case 'pp': return formatPercentPoints(insight.delta);
        case 'rel': return formatPercent(insight.delta, true);
        default: return String(insight.delta);
    }
};

const ProvenancePill: React.FC<{ type: TopInsight['provenance'] }> = ({ type }) => {
    const styles: { [key in TopInsight['provenance']]: string } = {
        'faktisch': 'bg-green-100 text-green-700',
        'geparst': 'bg-blue-100 text-blue-700',
        'klassifiziert': 'bg-yellow-100 text-yellow-700',
        'semantik': 'bg-purple-100 text-purple-700',
    };
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[type]}`}>{capitalizedType}</span>;
};

// --- DETAIL VISUALIZATION COMPONENT ---

const DetailContent: React.FC<{ 
    insight: TopInsight;
    currentPeriodLabel?: string;
    previousPeriodLabel?: string;
}> = ({ insight, currentPeriodLabel, previousPeriodLabel }) => {
    const { detailData, interpretation, calculationNote } = insight;

    const renderVisualization = () => {
        if (!detailData) return null;

        // Specific render logic for general insights cards
        switch (insight.id) {
            case 'gen_activity':
                if (Array.isArray(detailData)) {
                    const chartData = detailData.map(d => ({ name: d.window, value: d.count_tenders }));
                    return <SimpleBarChart data={chartData} valueType="count" />;
                }
                break;
            case 'gen_ai_primary':
            case 'gen_framework':
                if (detailData.barData) {
                    const chartData = detailData.barData.map((d: any) => ({ name: d.name, value: d.value, n: d.n }));
                    return <SimpleBarChart data={chartData} valueType="share" />;
                }
                break;
            case 'gen_vergabeordnung':
                 if (Array.isArray(detailData)) {
                    return (
                        <div className="space-y-4">
                            {detailData.map((item: any) => (
                                <div key={item.name}>
                                    <div className="flex justify-between items-center text-sm font-semibold">
                                        <span className="text-text-primary">{item.name}</span>
                                        <div className="flex items-baseline">
                                            <span>{formatPercent(item.valueCurrent)}</span>
                                            <span className={`ml-2 text-xs ${item.delta > 0 ? 'text-green-600' : 'text-red-600'}`}>{formatPercentPoints(item.delta)}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 mt-1">
                                        <div className="bg-brand-orange h-2.5 rounded-full" style={{ width: `${item.valueCurrent * 100}%` }}></div>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-text-secondary mt-1">
                                        <span>{previousPeriodLabel}: {item.countPrevious}/{item.nPrevious}</span>
                                        <span>{currentPeriodLabel}: {item.countCurrent}/{item.nCurrent}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                }
                break;
        }

        // Generic render logic for other tabs
        if (detailData.items) return <BenchmarkList items={detailData.items} />;
        if (detailData.bars) return <LeistungenBarChart data={detailData.bars} />;
        if (detailData.dumbbell) return <DumbbellChart data={detailData.dumbbell} />;
        if (detailData.mini_bars) {
            const chartData = detailData.mini_bars.map((d: any) => ({ name: d.label, value: d.median_pct / 100, n: d.n }));
            return <SimpleBarChart data={chartData} valueType="share" />;
        }
        
        return null;
    };

    const interpretationContent = Array.isArray(interpretation) ? interpretation : (interpretation ? [interpretation] : []);

    return (
        <div className="space-y-6 pt-4 animate-fade-in">
            {renderVisualization()}
            
            {interpretationContent.length > 0 && (
                <div>
                    <h5 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Interpretation</h5>
                    <div className="bg-brand-background p-4 rounded-xl text-sm text-text-secondary space-y-2">
                        {interpretationContent.map((text, i) => (
                            <div key={i} className="flex items-start">
                                <span className="text-brand-orange mr-2 mt-1 font-semibold">–</span>
                                <p dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-text-primary">$1</strong>') }} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {(calculationNote || detailData?.method) && (
                <div>
                    <h5 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Methodik & Hinweise</h5>
                    <p className="text-xs text-text-secondary">{calculationNote || detailData.method}</p>
                </div>
            )}
        </div>
    );
};


// --- MAIN CARD COMPONENT ---

interface TopInsightCardProps {
    insight: TopInsight;
    deltaView: DeltaView;
    currentPeriodLabel?: string;
    previousPeriodLabel?: string;
}

export const TopInsightCard: React.FC<TopInsightCardProps> = ({ insight, deltaView, currentPeriodLabel, previousPeriodLabel }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const delta = getFormattedDelta(insight);
    const deltaColor = (insight.delta ?? 0) > 0.0001 ? 'text-green-600' : (insight.delta ?? 0) < -0.0001 ? 'text-red-600' : 'text-gray-500';
    const hasDetails = !!insight.detailData || !!insight.interpretation || !!insight.calculationNote;

    return (
        <div className="bg-surface border border-border-color p-5 rounded-2xl shadow-subtle flex flex-col h-full">
            {/* --- Header --- */}
            <div className="flex-shrink-0">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-text-primary text-base leading-tight pr-2">{insight.title}</h3>
                    <ProvenancePill type={insight.provenance} />
                </div>
                <p className="text-sm text-text-secondary mb-4 min-h-[20px]">{insight.subtitle}</p>
            </div>
            
            {/* --- KPI --- */}
            <div className="flex justify-between items-end mt-auto flex-shrink-0">
                <p className="text-4xl font-bold text-text-primary">{getFormattedValue(insight)}</p>
                {delta !== '-' && Math.abs(insight.delta) > 0 && (
                     <div className={`text-right font-semibold ${deltaColor}`}>
                        {delta}
                        <span className="block text-xs font-normal text-text-secondary">{deltaView}</span>
                     </div>
                )}
            </div>

            {/* --- Expandable Section --- */}
            {hasDetails && (
                <div className="mt-4 pt-4 border-t border-border-color">
                     <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full flex justify-between items-center text-sm font-semibold text-brand-orange hover:text-orange-700"
                        aria-expanded={isExpanded}
                    >
                        <span>{isExpanded ? 'Details ausblenden' : 'Details anzeigen'}</span>
                        <svg className={`w-5 h-5 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {isExpanded && (
                        <DetailContent 
                            insight={insight} 
                            currentPeriodLabel={currentPeriodLabel}
                            previousPeriodLabel={previousPeriodLabel}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
