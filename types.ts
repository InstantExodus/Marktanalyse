// FIX: Provide definitions for shared TypeScript types.
export type PillType = 'faktisch' | 'geparst' | 'klassifiziert' | 'semantik';

export type DeltaView = 'QoQ' | 'YoY';

// For general "other insights"
export interface Insight {
    id: string;
    title: string;
    trend: string;
    pill: PillType;
    provenance: string;
    details: {
        latest_share?: number;
        count?: number;
        delta_qoq?: number;
        delta_yoy?: number;
        deltaType: 'pp' | 'rel';
        caveats?: string[];
    };
}

// For main dashboard "top insights"
export interface TopInsight {
    id: string;
    title: string;
    subtitle: string;
    value: number; // The main KPI value, as a decimal (e.g., 0.696 for 69.6%)
    delta: number; // The change, as a decimal
    valueType: 'share' | 'currency' | 'count';
    deltaType: 'pp' | 'rel'; // pp for percentage points, rel for relative
    provenance: PillType;
    interpretation?: string | string[]; // Can be a single string or an array of strings
    detailData?: any; // This will hold the specific data for the modal/detail view
    calculationNote?: string;
}

// For executive summaries
export interface SummaryPoint {
    title: string;
    description: string;
    icon: string;
}
