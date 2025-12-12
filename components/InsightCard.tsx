import React, { useState } from 'react';
// FIX: Add file extension to import path.
import type { Insight, PillType } from '../types.ts';
import type { DeltaView } from '../hooks/useData';
import { Metric } from './Metric';
import { formatNumber, formatPercent } from '../utils/formatters';

const ProvenancePill: React.FC<{ type: PillType }> = ({ type }) => {
    // FIX: Use lowercase keys to match the PillType definition.
    const styles: { [key in PillType]: string } = {
        'faktisch': 'bg-green-50 text-green-700',
        'geparst': 'bg-blue-50 text-blue-700',
        'klassifiziert': 'bg-yellow-50 text-yellow-700',
        'semantik': 'bg-purple-50 text-purple-700',
    };
    // FIX: Capitalize the output for better display.
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[type]}`}>{capitalizedType}</span>;
};

interface InsightCardProps {
    insight: Insight;
    deltaView: DeltaView;
    startCollapsed?: boolean;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, deltaView, startCollapsed = false }) => {
    const [isExpanded, setIsExpanded] = useState(!startCollapsed);
    const { title, trend, pill, provenance, details } = insight;

    const delta = deltaView === 'QoQ' ? details.delta_qoq : details.delta_yoy;
    const deltaType = details.deltaType === 'rel' ? 'percent' : 'pp';

    const toggleExpand = (e: React.MouseEvent) => {
        // Allow text selection
        if (window.getSelection()?.toString()) {
            return;
        }
        e.preventDefault();
        setIsExpanded(!isExpanded);
    };

    return (
        <div 
            className="bg-surface border border-border-color p-6 rounded-2xl shadow-subtle cursor-pointer h-full flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-1" 
            onClick={toggleExpand} 
            role="button" 
            tabIndex={0} 
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleExpand(e as any)}
        >
            <div className="flex justify-between items-start gap-4">
                <h4 className="text-lg font-bold text-text-primary">{title}</h4>
                <ProvenancePill type={pill} />
            </div>
            <div className="flex justify-between items-baseline mt-2 mb-4">
                 <p className="text-base font-medium text-brand-orange">{trend}</p>
            </div>

            {isExpanded && (
                <div className="mt-auto pt-4 border-t border-border-color animate-fade-in">
                    <p className="text-sm text-text-secondary mb-4">{provenance}</p>
                    <div className="space-y-3">
                        {details.latest_share !== undefined && <Metric label="Anteil" value={formatPercent(details.latest_share)} />}
                        {details.count !== undefined && <Metric label="Anzahl" value={formatNumber(details.count)} />}
                        <Metric label={`Veränderung (${deltaView})`} value="" delta={delta} deltaType={deltaType} valueFirst={true} deltaView={deltaView} />
                        {details.caveats && details.caveats.length > 0 && (
                            <div className="pt-2">
                                <h5 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Hinweise</h5>
                                <ul className="list-disc list-inside text-sm text-text-secondary mt-1 space-y-1">
                                    {details.caveats.map((caveat, i) => <li key={i}>{caveat}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};