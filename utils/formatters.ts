// FIX: Add file extension to import path.
import { PillType } from '../types.ts';

export const formatCurrency = (value: number | undefined | null, currency = 'EUR', maximumFractionDigits = 0): string => {
    if (value === undefined || value === null || isNaN(value)) return 'N/A';
    
    if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toLocaleString('de-DE', { maximumFractionDigits: 2 })} Mrd €`;
    }
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toLocaleString('de-DE', { maximumFractionDigits: 2 })} Mio €`;
    }
    return value.toLocaleString('de-DE', { style: 'currency', currency, maximumFractionDigits });
};

export const formatPercent = (value: number | undefined | null, forceSign = false): string => {
    if (value === undefined || value === null || isNaN(value)) return 'N/A';
    const formatted = new Intl.NumberFormat('de-DE', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    }).format(value);
    
    if (forceSign && value > 0) {
        return `+${formatted}`;
    }
    return formatted;
};

export const formatPercentPoints = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value) || Math.abs(value) < 0.0001) return '±0,0 pp';
    const formatted = (value * 100).toFixed(1).replace('.', ',');
    const sign = value > 0 ? '+' : '';
    return `${sign}${formatted} pp`;
};


export const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) return 'N/A';
    return new Intl.NumberFormat('de-DE').format(Math.round(value));
}

export const formatQuarter = (quarter: string): string => {
    if (!quarter || quarter.length !== 6) return quarter; // e.g. 2025Q2
    const year = quarter.substring(0, 4);
    const q = quarter.substring(4);
    return `${q}/${year}`;
};

export const formatPeriodLabel = (period: string): string => {
    if (!period) return period;

    // Handle "H1/2025" format
    if (period.startsWith('H')) {
        const parts = period.split('/');
        if (parts.length === 2) {
            const h = parts[0].substring(1);
            return `Halbjahr ${h} ${parts[1]}`;
        }
    }

    // Handle "2025Q2" format
    if (period.match(/^\d{4}Q[1-4]$/)) {
        const year = period.substring(0, 4);
        const q = period.substring(5);
        return `Quartal ${q} ${year}`;
    }
    
    // Handle "Q2/2025" format
    if (period.match(/^Q[1-4]\/\d{4}$/)) {
         const parts = period.split('/');
         const q = parts[0].substring(1);
         return `Quartal ${q} ${parts[1]}`;
    }

    return period; // Fallback
}

// --- New Trend and Provenance Helpers ---

export const getTrendPhrase = (yoy: number | undefined, qoq: number | undefined, type: 'pp' | 'rel' = 'pp'): string => {
    const delta = yoy ?? qoq;
    if (delta === undefined || delta === null || isNaN(delta)) {
        return 'weitgehend stabil';
    }

    if (type === 'pp') {
        if (delta >= 0.08) return 'nimmt klar zu';
        if (delta >= 0.03) return 'nimmt leicht zu';
        if (delta > -0.03) return 'weitgehend stabil';
        if (delta > -0.08) return 'nimmt leicht ab';
        return 'nimmt klar ab';
    } else { // 'rel' for counts
        if (delta >= 0.20) return 'nimmt klar zu';
        if (delta >= 0.05) return 'nimmt leicht zu';
        if (delta > -0.05) return 'weitgehend stabil';
        if (delta > -0.20) return 'nimmt leicht ab';
        return 'nimmt klar ab';
    }
};

type ProvenanceResult = { pill: PillType; provenance: string; };

export const getProvenance = (family: string, texts?: any): ProvenanceResult => {
    const defaultTexts = {
        faktisch: "Aus strukturierten Vergabedaten (Metadaten).",
        geparst: "Direkt aus Originaltext ausgelesen; Format kann variieren.",
        klassifiziert: "LLM‑gestützte Zuordnung zu vordefinierten Kategorien; Mehrfachnennungen möglich.",
        semantik: "Semantisch ermitteltes Muster; Orientierung, keine harte Quote."
    };
    const pTexts = texts || defaultTexts;

    switch (family) {
        case 'leistungen':
        case 'branchen':
        case 'tools':
        case 'profiles':
        case 'primär_ki':
        case 'ki_primary':
            return { pill: 'klassifiziert', provenance: pTexts.klassifiziert };
        case 'region':
        case 'vergabeordnung':
        case 'rahmenvertrag':
        case 'volumen':
        case 'marktaktivitaet':
        case 'framework':
            return { pill: 'faktisch', provenance: pTexts.faktisch };
        case 'award_criteria':
            return { pill: 'faktisch', provenance: pTexts.faktisch };
        case 'semantik':
        case 'topics':
            return { pill: 'klassifiziert', provenance: pTexts.klassifiziert };
        default:
            return { pill: 'klassifiziert', provenance: "Basierend auf Vergabedaten; Details auf Klick." };
    }
};