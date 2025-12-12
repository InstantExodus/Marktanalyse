import React from 'react';

export const BDInfoBox: React.FC = () => {
    return (
        <div className="bg-surface border border-border-color p-4 rounded-2xl mb-8 text-sm" role="alert">
            <h4 className="font-semibold text-text-primary mb-2 flex items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-text-secondary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Methodik für Business Development
            </h4>
            <ul className="list-disc list-inside space-y-1 pl-7 text-text-secondary">
                <li><strong>Klassifiziert (Phasen/Themen/Rollen):</strong> Per Textklassifikation aus Vergabetexten (Orientierung, bitte vorsichtig lesen).</li>
                <li><strong>Metadaten (Region/Rahmenvertrag/Primär-KI):</strong> Aus strukturierten Datenfeldern.</li>
                <li><strong>Geparst (Zuschlagskriterien):</strong> Aus Freitext extrahiert.</li>
                 <li><strong>Volumen:</strong> Nur teilweise vorhanden; Auswertungen dazu mit Vorsicht genießen.</li>
            </ul>
        </div>
    );
};