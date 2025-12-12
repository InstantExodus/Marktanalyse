import React from 'react';
// FIX: Add file extension to import path.
import type { Insight } from '../types.ts';
import type { DeltaView } from '../hooks/useData';
import { InsightCard } from './InsightCard';

interface InsightsTabProps {
    insights: Insight[];
    deltaView: DeltaView;
    title: string;
}

export const InsightsTab: React.FC<InsightsTabProps> = ({ insights, deltaView, title }) => (
    <div className="mt-6">
        <h3 className="text-xl font-bold text-brand-dark-gray mb-4">{title}</h3>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
            {insights.map(insight => (
                <InsightCard 
                    key={insight.id} 
                    insight={insight} 
                    deltaView={deltaView}
                />
            ))}
        </div>
    </div>
);