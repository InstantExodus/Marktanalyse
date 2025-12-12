import React, { useState } from 'react';
import { useData, DeltaView } from './hooks/useData.ts';
import { ToggleSwitch } from './components/ToggleSwitch.tsx';
import { Tab } from './components/Tab.tsx';
import { ExecutiveSummary } from './components/ExecutiveSummary.tsx';
import { DashboardGrid } from './components/DashboardGrid.tsx';
import { InsightsTab } from './components/InsightsTab.tsx';
import { ComparisonInfoBox } from './components/ComparisonInfoBox.tsx';
import { ProcessInfo } from './components/ProcessInfo.tsx';
import { BusinessDevelopmentTab } from './components/BusinessDevelopmentTab.tsx';

type TabName = 'general' | 'implementierung' | 'consulting' | 'bd';

const App: React.FC = () => {
    const [deltaView, setDeltaView] = useState<DeltaView>('YoY');
    const [activeTab, setActiveTab] = useState<TabName>('general');

    const { data, loading, error } = useData(deltaView);

    const renderContent = () => {
        if (loading) {
            return <div className="text-center p-10">Lade Daten...</div>;
        }
        if (error) {
            return <div className="text-center p-10 text-red-600">Fehler beim Laden der Daten: {error}</div>;
        }
        if (!data) {
            return <div className="text-center p-10">Keine Daten verfügbar.</div>;
        }

        switch (activeTab) {
            case 'general':
                return (
                    <>
                        <ExecutiveSummary title={`Executive Summary – ${deltaView}`} summaryPoints={data.executiveSummaryPoints} />
                        <h3 className="text-2xl font-bold text-text-primary mb-4">Top-Metriken</h3>
                        <DashboardGrid 
                            topInsights={data.topInsights} 
                            deltaView={deltaView}
                            currentPeriodLabel={data.currentPeriodLabel}
                            previousPeriodLabel={data.previousPeriodLabel}
                        />
                        <InsightsTab insights={data.otherInsights} deltaView={deltaView} title="Weitere Insights" />
                    </>
                );
            case 'implementierung':
                 return (
                    <>
                        <ExecutiveSummary title={`Implementierung – Executive Summary ${deltaView}`} summaryPoints={data.executiveSummaries.implementierung[deltaView.toLowerCase() as 'yoy' | 'qoq']} />
                        <h3 className="text-2xl font-bold text-text-primary mb-4">Metriken Implementierung</h3>
                        <DashboardGrid topInsights={data.implementierungData} deltaView={deltaView} />
                    </>
                );
            case 'consulting':
                 return (
                    <>
                        <ExecutiveSummary title={`Consulting – Executive Summary ${deltaView}`} summaryPoints={data.executiveSummaries.consulting[deltaView.toLowerCase() as 'yoy' | 'qoq']} />
                        <h3 className="text-2xl font-bold text-text-primary mb-4">Metriken Consulting</h3>
                        <DashboardGrid topInsights={data.consultingData.insights} deltaView={deltaView} />
                    </>
                );
             case 'bd':
                return (
                    <>
                       <ExecutiveSummary title={`Business Development – Executive Summary ${deltaView}`} summaryPoints={data.businessDevelopmentData.executiveSummaryPoints} />
                       <BusinessDevelopmentTab insights={data.businessDevelopmentData.insights} deltaView={deltaView} />
                    </>
                );
            default:
                return null;
        }
    };

    const tabs: { id: TabName; name: string }[] = [
        { id: 'general', name: 'Überblick' },
        { id: 'implementierung', name: 'Implementierung' },
        { id: 'consulting', name: 'Consulting' },
        { id: 'bd', name: 'Business Development' },
    ];

    return (
        <div className="bg-brand-background min-h-screen font-sans text-text-primary">
            <header className="bg-surface border-b border-border-color sticky top-0 z-10">
                 <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-brand-orange">KI-Marktanalyse Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <ToggleSwitch
                            label="Vergleich"
                            option1="QoQ"
                            option2="YoY"
                            option1Label="QoQ"
                            option2Label="YTD"
                            selected={deltaView}
                            setSelected={(value) => setDeltaView(value)}
                        />
                        <ComparisonInfoBox currentPeriod={data?.currentPeriodLabel} previousPeriod={data?.previousPeriodLabel}/>
                    </div>
                </div>
                <div className="container mx-auto px-6">
                     <nav className="flex items-center space-x-2">
                        {tabs.map(tab => (
                            <Tab
                                key={tab.id}
                                name={tab.name}
                                isActive={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                            />
                        ))}
                    </nav>
                </div>
            </header>
            <main className="container mx-auto p-6">
                <ProcessInfo />
                {renderContent()}
            </main>
        </div>
    );
};

export default App;
