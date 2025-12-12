import { useState, useEffect, useMemo } from 'react';
import type { TopInsight, PillType } from '../types.ts';


export type DeltaView = 'QoQ' | 'YoY';

export const useData = (deltaView: DeltaView) => {
    const [generalInsightsData, setGeneralInsightsData] = useState<any | null>(null);
    const [implementationData, setImplementationData] = useState<any | null>(null);
    const [consultingData, setConsultingData] = useState<any | null>(null);
    const [bdData, setBdData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // HIER WICHTIG: Wir nutzen generische Dateinamen. 
                // Für ein neues Quartal müssen nur diese Dateien im data/ Ordner ersetzt werden.
                const [generalResponse, implementationResponse, consultingResponse, bdResponse] = await Promise.all([
                    fetch('./data/general_insights.json'),
                    fetch('./data/implementation_insights.json'),
                    fetch('./data/consulting_insights.json'),
                    fetch('./data/bd_insights.json')
                ]);

                if (!generalResponse.ok) throw new Error(`General JSON error: ${generalResponse.status}`);
                if (!implementationResponse.ok) throw new Error(`Implementation JSON error: ${implementationResponse.status}`);
                if (!consultingResponse.ok) throw new Error(`Consulting JSON error: ${consultingResponse.status}`);
                if (!bdResponse.ok) throw new Error(`BD JSON error: ${bdResponse.status}`);

                setGeneralInsightsData(await generalResponse.json());
                setImplementationData(await implementationResponse.json());
                setConsultingData(await consultingResponse.json());
                setBdData(await bdResponse.json());
            } catch (e) {
                 console.error("Fehler beim Laden der JSON-Daten:", e);
                 setError(e instanceof Error ? e.message : String(e));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const result = useMemo(() => {
        if (!generalInsightsData || !implementationData || !consultingData || !bdData) {
            return { data: null, processingError: null };
        }

        try {
            // --- GENERAL INSIGHTS ---
            // Wählt dynamisch den korrekten Ast (YTD oder QoQ) basierend auf dem Toggle im UI
            const generalInsights = deltaView === 'YoY' ? generalInsightsData.YTD : generalInsightsData.QoQ;
            const {
                executiveSummaryPoints,
                topInsights,
                otherInsights,
                currentPeriodLabel,
                previousPeriodLabel
            } = generalInsights;

            // --- IMPLEMENTATION TAB ---
            const implViewData = deltaView === 'YoY' ? implementationData.YTD : implementationData.QoQ;
            
            // --- CONSULTING TAB ---
            const consViewData = deltaView === 'YoY' ? consultingData.YTD : consultingData.QoQ;

            // --- BUSINESS DEVELOPMENT TAB ---
            const bdViewData = deltaView === 'YoY' ? bdData.YTD : bdData.QoQ;

             // Strukturierte Summaries für die spezifischen Tabs
             const structuredExecutiveSummaries = {
                implementierung: {
                    yoy: implementationData.YTD.executiveSummaryPoints,
                    qoq: implementationData.QoQ.executiveSummaryPoints
                },
                consulting: {
                    yoy: consultingData.YTD.executiveSummaryPoints,
                    qoq: consultingData.QoQ.executiveSummaryPoints
                },
                bd: {
                    yoy: bdData.YTD.executiveSummaryPoints,
                    qoq: bdData.QoQ.executiveSummaryPoints
                }
            };
            
            // Aufbau des finalen Datenobjekts für die App
            const data = {
                // Labels kommen direkt aus dem JSON
                currentPeriodLabel,
                previousPeriodLabel,
                
                // General Insights
                executiveSummaryPoints,
                topInsights,
                otherInsights,
                
                // Other tabs data
                implementierungData: implViewData.cards,
                executiveSummaries: structuredExecutiveSummaries,
                businessDevelopmentData: {
                    executiveSummaryPoints: bdViewData.executiveSummaryPoints,
                    insights: bdViewData.cards
                },
                consultingData: {
                    executiveSummaryPoints: consViewData.executiveSummaryPoints,
                    insights: consViewData.cards
                },
            };
            return { data, processingError: null };
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            console.error("Fehler bei der Datenverarbeitung:", e);
            return { data: null, processingError: errorMessage };
        }
    }, [deltaView, generalInsightsData, implementationData, consultingData, bdData]);
    
    return { data: result.data, loading, error: error || result.processingError };
};