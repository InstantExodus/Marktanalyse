import React, { useState, useRef, useEffect } from 'react';

interface ComparisonInfoBoxProps {
    currentPeriod?: string;
    previousPeriod?: string;
}

export const ComparisonInfoBox: React.FC<ComparisonInfoBoxProps> = ({ currentPeriod, previousPeriod }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const ytdLabel = `Zeigt **Year-to-Date (${currentPeriod} vs. ${previousPeriod})**: Quartale gebündelt.`;
    const qoqLabel = `Zeigt **Quartalsvergleich (${currentPeriod} vs. ${previousPeriod})**.`;


    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-text-secondary hover:text-brand-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-full"
                aria-label="Informationen zur Vergleichslogik"
                aria-expanded={isOpen}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
            {isOpen && (
                <div 
                    className="absolute right-0 mt-2 w-72 p-4 bg-surface rounded-2xl shadow-lg z-20 border border-brand-orange/20 animate-fade-in"
                >
                    <h4 className="font-semibold text-text-primary text-base mb-2">Vergleichslogik</h4>
                    <ul className="space-y-2 text-sm text-text-secondary">
                       <li className="flex items-start">
                            <strong className="w-12 flex-shrink-0 font-semibold text-text-primary">YTD:</strong>
                            <span>{ytdLabel.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold text-text-primary">{part}</strong> : part)}</span>
                        </li>
                        <li className="flex items-start">
                            <strong className="w-12 flex-shrink-0 font-semibold text-text-primary">QoQ:</strong>
                            <span>{qoqLabel.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold text-text-primary">{part}</strong> : part)}</span>
                        </li>
                    </ul>
                     <div className="mt-3 pt-3 border-t border-border-color">
                        <p className="text-xs text-text-secondary">
                            <strong>"Faktisch"</strong> = Metadaten; <strong>"Klassifiziert"</strong> = LLM-Zuordnung (Orientierung). Volumenangaben liegen nur teilweise vor (eingeschränkte Aussagekraft).
                        </p>
                     </div>
                </div>
            )}
        </div>
    );
};