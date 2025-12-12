import React from 'react';
import type { TopInsight } from '../types.ts';
import type { DeltaView } from '../hooks/useData.ts';
import { BDInfoBox } from './BDInfoBox.tsx';
import { DashboardGrid } from './DashboardGrid.tsx';

interface BusinessDevelopmentTabProps {
    insights: TopInsight[];
    deltaView: DeltaView;
}

export const BusinessDevelopmentTab: React.FC<BusinessDevelopmentTabProps> = ({ insights, deltaView }) => {
    return (
        <div className="mt-6">
            <BDInfoBox />
            <DashboardGrid topInsights={insights} deltaView={deltaView} />
        </div>
    );
};
