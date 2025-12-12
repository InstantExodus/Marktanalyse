import React from 'react';
import type { TopInsight } from '../types.ts';
import type { DeltaView } from '../hooks/useData.ts';
import { TopInsightCard } from './TopInsightCard.tsx';

interface DashboardGridProps {
    topInsights: TopInsight[];
    deltaView: DeltaView;
    currentPeriodLabel?: string;
    previousPeriodLabel?: string;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ topInsights, deltaView, currentPeriodLabel, previousPeriodLabel }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topInsights.map((insight) => (
                <TopInsightCard 
                    key={insight.id} 
                    insight={insight} 
                    deltaView={deltaView}
                    currentPeriodLabel={currentPeriodLabel}
                    previousPeriodLabel={previousPeriodLabel}
                />
            ))}
        </div>
    );
};
