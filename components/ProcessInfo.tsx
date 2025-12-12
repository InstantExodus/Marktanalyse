import React, { useState } from 'react';

const ProcessStep: React.FC<{ icon: string; title: string; description: string; step: number; }> = ({ icon, title, description, step }) => (
    <div className="flex-1 text-center px-2 min-w-[160px]">
        <div className="bg-gray-100 text-brand-orange rounded-full w-16 h-16 flex items-center justify-center mx-auto text-3xl mb-3 relative">
            {icon}
            <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-surface">{step}</span>
        </div>
        <h4 className="font-semibold text-text-primary">{title}</h4>
        <p className="text-sm text-text-secondary">{description}</p>
    </div>
);

export const ProcessInfo: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-surface rounded-2xl shadow-subtle mb-8 border border-brand-orange/20">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 text-left flex justify-between items-center"
                aria-expanded={isExpanded}
                aria-controls="process-info-content"
            >
                <h2 className="text-xl font-semibold text-text-primary">Analyseprozess & Methodik</h2>
                <svg className={`w-6 h-6 transform transition-transform duration-300 text-text-secondary ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isExpanded && (
                <div id="process-info-content" className="p-6 pt-0 animate-fade-in">
                    <div className="flex flex-col lg:flex-row items-start justify-center relative mb-8 gap-y-6 pt-4 flex-wrap">
                         <ProcessStep icon="📥" title="Datenerfassung" description="Relevante KI-Ausschreibungen aus Vergabetool erfasst." step={1} />
                         <div className="flex-shrink-0 text-border-color text-2xl mx-2 mt-8 hidden lg:block">→</div>
                         <ProcessStep icon="🤖" title="LLM-Klassifizierung" description="Clustering durch Gemini 2.5 Pro in vordefinierte Kategorien (z.B. Leistungen, Branchen, Profile)." step={2} />
                         <div className="flex-shrink-0 text-border-color text-2xl mx-2 mt-8 hidden lg:block">→</div>
                         <ProcessStep icon="📊" title="Aggregation" description="Datenbereinigung & Visualisierung in PowerBI." step={3} />
                         <div className="flex-shrink-0 text-border-color text-2xl mx-2 mt-8 hidden lg:block">→</div>
                         <ProcessStep icon="💡" title="Insight-Generierung" description="Berechnung von Metriken & Ableitung von Trends." step={4} />
                         <div className="flex-shrink-0 text-border-color text-2xl mx-2 mt-8 hidden lg:block">→</div>
                         <ProcessStep icon="🎯" title="Dashboard-Integration" description="Integration der Metriken in dieses interaktive Dashboard." step={5} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-brand-background p-4 rounded-xl">
                            <h3 className="text-base font-semibold text-text-primary mb-2">Nutzen dieses Dashboards</h3>
                            <p className="text-sm text-text-secondary">
                                Dieses Dashboard baut auf dem PowerBI-Bericht auf und bietet einen entscheidenden Mehrwert:
                            </p>
                            <ul className="list-disc list-inside text-sm text-text-secondary space-y-1 mt-2">
                                <li>Alle wichtigen <strong>Metriken & Trends</strong> auf einen Blick.</li>
                                <li><strong>Stakeholder-spezifische</strong> Ansichten für gezielte Analysen.</li>
                            </ul>
                        </div>
                        <div className="bg-brand-background p-4 rounded-xl">
                            <h3 className="text-base font-semibold text-text-primary mb-2">Abgrenzung zum PowerBI-Bericht</h3>
                            <p className="text-sm text-text-secondary">
                                Der PowerBI-Bericht zur KI-Marktanalyse liefert eine gute Übersicht, erfordert für Detailanalysen jedoch die manuelle Kombination von Tabellen und die Berechnung von Metriken direkt aus den Visuals.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-xl">
                        <h3 className="text-base font-semibold text-text-primary mb-2">Methodik & Limitationen</h3>
                        <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                            <li><strong>Klassifizierte Daten:</strong> Kategorien wie Leistungen, Branchen, Profile & Primär-KI wurden per LLM (Gemini 2.5 Pro) zugewiesen und sind als <strong>Tendenzen</strong> zu verstehen.</li>
                            <li><strong>Faktische Daten:</strong> Informationen wie Vergabeordnung, Volumen oder Region wurden direkt aus dem Vergabetool übernommen.</li>
                            <li><strong>Unvollständige Volumenangaben:</strong> Das Auftragsvolumen ist nur bei einem Teil der Ausschreibungen bekannt und dient als Indikator.</li>
                            <li><strong>Limitierte Informationsbasis:</strong> Das Vergabetool enthält oft nur Textauszüge der Vergaben, was die Detailtiefe der Analyse einschränken kann.</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};