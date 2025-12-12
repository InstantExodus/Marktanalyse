import { useState, useEffect, useMemo } from 'react';
// FIX: Add file extension to import path.
import type { TopInsight, PillType } from '../types.ts';
import { executiveSummaries as staticExecutiveSummaries } from '../content/summaries';


export type DeltaView = 'QoQ' | 'YoY';

const implementationToolsRaw = `{
  "meta": {
    "note": "Fokus auf Programmiersprachen & Hosting. Weitere Kategorien werden derzeit selten/nie konkret gefordert.",
    "periods": {
      "QoQ": {
        "from": "Q1 2025",
        "to": "Q2 2025"
      },
      "YoY_YTD": {
        "from": "Q1+Q2 2024",
        "to": "Q1+Q2 2025"
      }
    },
    "excluded_categories": [
      "datenbank",
      "devops"
    ],
    "sparse_categories": [
      "bitools",
      "colab"
    ],
    "granularity": "Kategorie-Ebene, keine Einzel-Tool-Trends wegen geringer Nennungen"
  },
  "cards": {
    "QoQ": {
      "hosting": {
        "no_tool": {
          "from_pct": 74.1,
          "to_pct": 77.8,
          "delta_pp": 3.7,
          "dir": "↑",
          "text": "Ohne-Tool-Anteil: Anstieg um 3.7 pp QoQ."
        },
        "specific_tool": {
          "from_pct": 25.9,
          "to_pct": 22.2,
          "delta_pp": -3.7,
          "dir": "↓",
          "text": "Mit-Tool-Anteil: Rückgang um 3.7 pp QoQ."
        }
      },
      "programmier": {
        "no_tool": {
          "from_pct": 82.6,
          "to_pct": 76.1,
          "delta_pp": -6.6,
          "dir": "↓",
          "text": "Ohne-Tool-Anteil: Rückgang um 6.6 pp QoQ."
        },
        "specific_tool": {
          "from_pct": 17.4,
          "to_pct": 23.9,
          "delta_pp": 6.6,
          "dir": "↑",
          "text": "Mit-Tool-Anteil: Anstieg um 6.6 pp QoQ."
        }
      }
    },
    "YoY": {
      "hosting": {
        "no_tool": {
          "from_pct": 91.6,
          "to_pct": 76.2,
          "delta_pp": -15.4,
          "dir": "↓",
          "text": "Ohne-Tool-Anteil: Rückgang um 15.4 pp YoY."
        },
        "specific_tool": {
          "from_pct": 8.4,
          "to_pct": 23.8,
          "delta_pp": 15.4,
          "dir": "↑",
          "text": "Mit-Tool-Anteil: Anstieg um 15.4 pp YoY."
        },
        "sample_sizes": {
          "ytd_2024_total": 83,
          "ytd_2025_total": 126
        }
      },
      "programmier": {
        "no_tool": {
          "from_pct": 75.6,
          "to_pct": 78.6,
          "delta_pp": 3.1,
          "dir": "↑",
          "text": "Ohne-Tool-Anteil: Anstieg um 3.1 pp YoY."
        },
        "specific_tool": {
          "from_pct": 24.4,
          "to_pct": 21.4,
          "delta_pp": -3.1,
          "dir": "↓",
          "text": "Mit-Tool-Anteil: Rückgang um 3.1 pp YoY."
        },
        "sample_sizes": {
          "ytd_2024_total": 86,
          "ytd_2025_total": 117
        }
      }
    }
  },
  "summary": {
    "high_level": [
      "Tool-Agnostik dominiert: In nahezu allen Kategorien überwiegt der Anteil ohne konkrete Tool-Nennung.",
      "Nur Programmiersprachen und Hosting zeigen ausreichend Signale für einfache QoQ/YoY-Statements.",
      "Andere Kategorien (siehe 'sparse_categories') werden derzeit praktisch nie konkret gefordert."
    ]
  }
}`;


// --- NEUE BD DATEN ---
const bdRawData = {
    bd_zuschlag_card: `{
  "schema": {
    "title": "Zuschlagskriterien – Preisanteil",
    "views": [
      "YTD",
      "QoQ"
    ],
    "dumbbell_item": {
      "label": "string",
      "ytd_2024_pct": "number",
      "n_2024": "number",
      "ytd_2025_pct": "number",
      "n_2025": "number"
    },
    "qoq_bar_item": {
      "label": "string",
      "median_pct": "number",
      "n": "number"
    },
    "header": {
      "title": "string",
      "value_pct": "number",
      "delta_pp": "number",
      "detail": "string",
      "sample_chips": "string"
    }
  },
  "YTD": {
    "header": {
      "title": "Median Preisanteil",
      "value_pct": 50.0,
      "delta_pp": 10.0,
      "detail": "Halbjahr 1 2025 vs. Halbjahr 1 2024",
      "sample_chips": "H1 2024: n=57 • H1 2025: n=84"
    },
    "dumbbell": [
      {
        "label": "Gesamt",
        "ytd_2024_pct": 40.0,
        "n_2024": 57,
        "ytd_2025_pct": 50.0,
        "n_2025": 84
      },
      {
        "label": "UVgO",
        "ytd_2024_pct": 32.5,
        "n_2024": 24,
        "ytd_2025_pct": 50.0,
        "n_2025": 37
      },
      {
        "label": "VgV",
        "ytd_2024_pct": 40.0,
        "n_2024": 32,
        "ytd_2025_pct": 45.0,
        "n_2025": 46
      }
    ],
    "interpretation": [
      "Der **Preis** gewinnt insgesamt an **Gewicht**; die Bewertung wirkt **wettbewerbsintensiver**.",
      "Unter **UVgO** ist der Anstieg **klarer ausgeprägt**; VgV erhöht sich moderat."
    ],
    "method": "Faktisch geparst aus Vergabeunterlagen. Mediane je Periode. Dumbbell zeigt H1 2024 vs. H1 2025."
  },
  "QoQ": {
    "header": {
      "title": "Median Preisanteil",
      "value_pct": 50.0,
      "delta_pp": 0.0,
      "detail": "Quartal 2 2025 vs. Quartal 1 2025",
      "sample_chips": "Q1 2025: n=34 • Q2 2025: n=50"
    },
    "mini_bars": [
      {
        "label": "Quartal 1 2025",
        "median_pct": 50.0,
        "n": 34
      },
      {
        "label": "Quartal 2 2025",
        "median_pct": 50.0,
        "n": 50
      }
    ],
    "interpretation": [
      "Gesamtbild **stabil**.",
      "Die **YoY-Aussage** ist derzeit **aussagekräftiger** als QoQ."
    ],
    "method": "Faktisch geparst; Quartalsvergleich der Mediane."
  }
}`,
    bd_top_leistungen_card: `{
  "schema": {
    "title": "Top-Leistungen",
    "view": [
      "YTD",
      "QoQ"
    ],
    "bar_item": {
      "label": "string",
      "value_pct": "number",
      "delta_pp": "number",
      "detail_current": "string",
      "detail_ref": "string"
    },
    "header": {
      "title": "string",
      "value_pct": "number",
      "delta_pp": "number",
      "detail": "string"
    }
  },
  "YTD": {
    "header": {
      "title": "Top-Leistung: Software- / Plattformentwicklung",
      "value_pct": 87.0,
      "delta_pp": -3.1,
      "detail": "100/115 in Halbjahr 1 2025"
    },
    "bars": [
      {
        "label": "Software- / Plattformentwicklung",
        "value_pct": 87.0,
        "delta_pp": -3.1,
        "detail_current": "100/115 in Halbjahr 1 2025",
        "detail_ref": "73/81 in Halbjahr 1 2024"
      },
      {
        "label": "Beratung und Unterstützung im Bereich KI / IT",
        "value_pct": 69.6,
        "delta_pp": 11.6,
        "detail_current": "80/115 in Halbjahr 1 2025",
        "detail_ref": "47/81 in Halbjahr 1 2024"
      },
      {
        "label": "Betrieb und Wartung von KI-Systemen",
        "value_pct": 40.9,
        "delta_pp": 18.7,
        "detail_current": "47/115 in Halbjahr 1 2025",
        "detail_ref": "18/81 in Halbjahr 1 2024"
      },
      {
        "label": "Training & Enablement",
        "value_pct": 23.5,
        "delta_pp": -1.2,
        "detail_current": "27/115 in Halbjahr 1 2025",
        "detail_ref": "20/81 in Halbjahr 1 2024"
      },
      {
        "label": "Datenmanagement und -aufbereitung für KI",
        "value_pct": 13.0,
        "delta_pp": 3.1,
        "detail_current": "15/115 in Halbjahr 1 2025",
        "detail_ref": "8/81 in Halbjahr 1 2024"
      },
      {
        "label": "Forschung & Studien zu KI",
        "value_pct": 10.4,
        "delta_pp": -3.2,
        "detail_current": "12/115 in Halbjahr 1 2025",
        "detail_ref": "11/81 in Halbjahr 1 2024"
      },
      {
        "label": "Proof of Concept (PoC) für KI-Anwendungen",
        "value_pct": 9.6,
        "delta_pp": 4.7,
        "detail_current": "11/115 in Halbjahr 1 2025",
        "detail_ref": "4/81 in Halbjahr 1 2024"
      },
      {
        "label": "Sicherheits- & Compliance-Prüfungen",
        "value_pct": 7.8,
        "delta_pp": 4.1,
        "detail_current": "9/115 in Halbjahr 1 2025",
        "detail_ref": "3/81 in Halbjahr 1 2024"
      }
    ]
  },
  "QoQ": {
    "header": {
      "title": "Top-Leistung: Software- / Plattformentwicklung",
      "value_pct": 77.9,
      "delta_pp": -22.1,
      "detail": "53/68 in Quartal 2 2025"
    },
    "bars": [
      {
        "label": "Software- / Plattformentwicklung",
        "value_pct": 77.9,
        "delta_pp": -22.1,
        "detail_current": "53/68 in Quartal 2 2025",
        "detail_ref": "47/47 in Quartal 1 2025"
      },
      {
        "label": "Beratung und Unterstützung im Bereich KI / IT",
        "value_pct": 69.1,
        "delta_pp": -1.1,
        "detail_current": "47/68 in Quartal 2 2025",
        "detail_ref": "33/47 in Quartal 1 2025"
      },
      {
        "label": "Betrieb und Wartung von KI-Systemen",
        "value_pct": 44.1,
        "delta_pp": 7.9,
        "detail_current": "30/68 in Quartal 2 2025",
        "detail_ref": "17/47 in Quartal 1 2025"
      },
      {
        "label": "Training & Enablement",
        "value_pct": 23.5,
        "delta_pp": 0.1,
        "detail_current": "16/68 in Quartal 2 2025",
        "detail_ref": "11/47 in Quartal 1 2025"
      },
      {
        "label": "Datenmanagement und -aufbereitung für KI",
        "value_pct": 17.6,
        "delta_pp": 11.2,
        "detail_current": "12/68 in Quartal 2 2025",
        "detail_ref": "3/64 in Quartal 1 2025"
      },
      {
        "label": "Forschung & Studien zu KI",
        "value_pct": 14.7,
        "delta_pp": 10.4,
        "detail_current": "10/68 in Quartal 2 2025",
        "detail_ref": "2/47 in Quartal 1 2025"
      },
      {
        "label": "Proof of Concept (PoC) für KI-Anwendungen",
        "value_pct": 8.8,
        "delta_pp": -1.8,
        "detail_current": "6/68 in Quartal 2 2025",
        "detail_ref": "5/47 in Quartal 1 2025"
      },
      {
        "label": "Sicherheits- & Compliance-Prüfungen",
        "value_pct": 8.8,
        "delta_pp": 2.4,
        "detail_current": "6/68 in Quartal 2 2025",
        "detail_ref": "3/47 in Quartal 1 2025"
      }
    ]
  },
  "method": "LLM-basierte Klassifizierung 'angefragte Leistungen' je Ausschreibung; Anteil = count/n der Zielperiode (n = Anzahl Ausschreibungen). Δ in Prozentpunkten zur Referenzperiode."
}`,
    bd_chatbot_card: `{
  "schema": {
    "title": "Fokus-Thema: Chatbot",
    "view": [
      "YTD",
      "QoQ"
    ],
    "bar_item": {
      "label": "string",
      "value_pct": "number",
      "delta_pp": "number",
      "detail_current": "string",
      "detail_ref": "string"
    },
    "header": {
      "title": "string",
      "value_pct": "number",
      "delta_pp": "number",
      "detail": "string"
    },
    "hidden_zero_regions": [
      "string"
    ]
  },
  "YTD": {
    "header": {
      "title": "Top-Region: Bayern",
      "value_pct": 50.0,
      "delta_pp": 25.0,
      "detail": "7/14 in Halbjahr 1 2025"
    },
    "bars": [
      {
        "label": "Mecklenburg-Vorpommern",
        "value_pct": 100.0,
        "delta_pp": 100.0,
        "detail_current": "1/1 in Halbjahr 1 2025",
        "detail_ref": "0/0 in Referenzperiode"
      },
      {
        "label": "Baden-Württemberg",
        "value_pct": 50.0,
        "delta_pp": 50.0,
        "detail_current": "2/4 in Halbjahr 1 2025",
        "detail_ref": "0/1 in Referenzperiode"
      },
      {
        "label": "Bayern",
        "value_pct": 50.0,
        "delta_pp": 25.0,
        "detail_current": "7/14 in Halbjahr 1 2025",
        "detail_ref": "1/4 in Referenzperiode"
      },
      {
        "label": "Niedersachsen",
        "value_pct": 42.9,
        "delta_pp": 22.9,
        "detail_current": "3/7 in Halbjahr 1 2025",
        "detail_ref": "1/5 in Referenzperiode"
      },
      {
        "label": "Rheinland-Pfalz",
        "value_pct": 28.6,
        "delta_pp": 28.6,
        "detail_current": "2/7 in Halbjahr 1 2025",
        "detail_ref": "0/0 in Referenzperiode"
      },
      {
        "label": "Hessen",
        "value_pct": 25.0,
        "delta_pp": -35.0,
        "detail_current": "1/4 in Halbjahr 1 2025",
        "detail_ref": "3/5 in Referenzperiode"
      },
      {
        "label": "Berlin",
        "value_pct": 18.2,
        "delta_pp": 18.2,
        "detail_current": "2/11 in Halbjahr 1 2025",
        "detail_ref": "0/6 in Referenzperiode"
      },
      {
        "label": "Bund",
        "value_pct": 7.4,
        "delta_pp": -6.9,
        "detail_current": "2/27 in Halbjahr 1 2025",
        "detail_ref": "3/21 in Referenzperiode"
      },
      {
        "label": "Nordrhein-Westfalen",
        "value_pct": 4.8,
        "delta_pp": -9.5,
        "detail_current": "1/21 in Halbjahr 1 2025",
        "detail_ref": "2/14 in Referenzperiode"
      }
    ],
    "hidden_zero_regions": [
      "Brandenburg",
      "Hamburg",
      "International",
      "Saarland",
      "Sachsen",
      "Sachsen-Anhalt",
      "Schleswig-Holstein",
      "Schweiz",
      "Österreich",
      "Thüringen"
    ],
    "hidden_zero_regions_count": 10,
    "hidden_zero_regions_label": "Weitere Regionen ohne Vorkommen: Brandenburg, Hamburg, International, Saarland, Sachsen …",
    "hidden_zero_regions_full": [
      "Brandenburg",
      "Hamburg",
      "International",
      "Saarland",
      "Sachsen",
      "Sachsen-Anhalt",
      "Schleswig-Holstein",
      "Schweiz",
      "Österreich",
      "Thüringen"
    ]
  },
  "QoQ": {
    "header": {
      "title": "Top-Region: Bund",
      "value_pct": 13.3,
      "delta_pp": 13.3,
      "detail": "2/15 in Quartal 2 2025"
    },
    "bars": [
      {
        "label": "Hessen",
        "value_pct": 100.0,
        "delta_pp": 100.0,
        "detail_current": "1/1 in Quartal 2 2025",
        "detail_ref": "0/3 in Referenzperiode"
      },
      {
        "label": "Mecklenburg-Vorpommern",
        "value_pct": 100.0,
        "delta_pp": 100.0,
        "detail_current": "1/1 in Quartal 2 2025",
        "detail_ref": "0/0 in Referenzperiode"
      },
      {
        "label": "Baden-Württemberg",
        "value_pct": 50.0,
        "delta_pp": 50.0,
        "detail_current": "2/4 in Quartal 2 2025",
        "detail_ref": "0/0 in Referenzperiode"
      },
      {
        "label": "Niedersachsen",
        "value_pct": 50.0,
        "delta_pp": 50.0,
        "detail_current": "3/6 in Quartal 2 2025",
        "detail_ref": "0/1 in Referenzperiode"
      },
      {
        "label": "Bayern",
        "value_pct": 44.4,
        "delta_pp": -15.6,
        "detail_current": "4/9 in Quartal 2 2025",
        "detail_ref": "3/5 in Referenzperiode"
      },
      {
        "label": "Rheinland-Pfalz",
        "value_pct": 25.0,
        "delta_pp": -8.3,
        "detail_current": "1/4 in Quartal 2 2025",
        "detail_ref": "1/3 in Referenzperiode"
      },
      {
        "label": "Berlin",
        "value_pct": 20.0,
        "delta_pp": 3.3,
        "detail_current": "1/5 in Quartal 2 2025",
        "detail_ref": "1/6 in Referenzperiode"
      },
      {
        "label": "Bund",
        "value_pct": 13.3,
        "delta_pp": 13.3,
        "detail_current": "2/15 in Quartal 2 2025",
        "detail_ref": "0/12 in Referenzperiode"
      },
      {
        "label": "Nordrhein-Westfalen",
        "value_pct": 7.1,
        "delta_pp": 7.1,
        "detail_current": "1/14 in Quartal 2 2025",
        "detail_ref": "0/7 in Referenzperiode"
      }
    ],
    "hidden_zero_regions": [
      "Brandenburg",
      "Hamburg",
      "International",
      "Saarland",
      "Sachsen",
      "Sachsen-Anhalt",
      "Schleswig-Holstein",
      "Schweiz",
      "Österreich"
    ],
    "hidden_zero_regions_count": 9,
    "hidden_zero_regions_label": "Weitere Regionen ohne Vorkommen: Brandenburg, Hamburg, International, Saarland, Sachsen …",
    "hidden_zero_regions_full": [
      "Brandenburg",
      "Hamburg",
      "International",
      "Saarland",
      "Sachsen",
      "Sachsen-Anhalt",
      "Schleswig-Holstein",
      "Schweiz",
      "Österreich"
    ]
  },
  "method": "Anteil der Ausschreibungen, deren Texte das Thema 'Chatbot' enthalten (semantisch geparst). Darstellung je Region mit Prozentwert und 'count/n' der Zielperiode. Δ = Differenz in Prozentpunkten zur Referenzperiode."
}`
};

const bdBenchmarkRawData = {
    bd_branch_bench: `{
  "schema": { "type": "bd_benchmark_list" },
  "YTD": {
    "header": {
      "title": "Branchen – Top Entwicklungen (vs. Gesamt)",
      "detail": "Halbjahr 1 2025 vs. Halbjahr 1 2024"
    },
    "items": [
      {
        "title": "Gesundheitswesen – Betrieb & Wartung",
        "delta_vs_benchmark_pp": 49.8,
        "focus_delta_pp": 55.6,
        "benchmark_delta_pp": 5.8,
        "confidence": "hoch",
        "evidence": {
          "focus": {
            "current": { "count": 10, "n": 18, "pct": 55.6 },
            "reference": { "count": 0, "n": 7, "pct": 0.0 }
          },
          "benchmark": {
            "current": { "count": 47, "n": 115, "pct": 15.6 },
            "reference": { "count": 18, "n": 81, "pct": 9.8 }
          }
        }
      },
      {
        "title": "Öffentliche Verwaltung – Datenmanagement",
        "delta_vs_benchmark_pp": 15.0,
        "focus_delta_pp": 15.6,
        "benchmark_delta_pp": 0.6,
        "confidence": "hoch",
        "evidence": {
          "focus": {
            "current": { "count": 10, "n": 39, "pct": 25.6 },
            "reference": { "count": 3, "n": 30, "pct": 10.0 }
          },
          "benchmark": {
            "current": { "count": 15, "n": 115, "pct": 5.0 },
            "reference": { "count": 8, "n": 81, "pct": 4.3 }
          }
        }
      },
      {
        "title": "Bildung & Forschung – Forschung/Studien",
        "delta_vs_benchmark_pp": 9.9,
        "focus_delta_pp": 7.9,
        "benchmark_delta_pp": -2.0,
        "confidence": "mittel",
        "evidence": {
          "focus": {
            "current": { "count": 4, "n": 18, "pct": 22.2 },
            "reference": { "count": 2, "n": 14, "pct": 14.3 }
          },
          "benchmark": {
            "current": { "count": 12, "n": 115, "pct": 4.0 },
            "reference": { "count": 11, "n": 81, "pct": 6.0 }
          }
        }
      }
    ],
    "interpretation": [
      "Im **Gesundheitswesen** gewinnt der **Betrieb von KI-Lösungen** **überproportional an Bedeutung**.",
      "**Datenmanagement** in der **öffentlichen Verwaltung** wächst ebenfalls **schneller als der Marktdurchschnitt**.",
      "**Forschungsthemen** in **Bildung & Forschung** halten sich **entgegen dem allgemeinen Markttrend**."
    ],
    "method": "Vergleich der prozentualen Veränderung (pp) einer Branchen-Leistungs-Kombination mit der Veränderung der Leistung im Gesamtmarkt."
  },
  "QoQ": {
    "header": {
      "title": "Branchen – Top Entwicklungen (vs. Gesamt)",
      "detail": "Quartal 2 2025 vs. Quartal 1 2025"
    },
    "items": [
      {
        "title": "Bildung & Forschung – Betrieb & Wartung",
        "delta_vs_benchmark_pp": 18.3,
        "focus_delta_pp": 26.2,
        "benchmark_delta_pp": 7.9,
        "confidence": "niedrig",
        "evidence": {
          "focus": {
            "current": { "count": 6, "n": 13, "pct": 46.2 },
            "reference": { "count": 1, "n": 5, "pct": 20.0 }
          },
          "benchmark": {
            "current": { "count": 30, "n": 68, "pct": 44.1 },
            "reference": { "count": 17, "n": 47, "pct": 36.2 }
          }
        }
      }
    ],
    "interpretation": [
      "Kurzfristig zeigt sich ein **starker Zuwachs** im **Betrieb von KI-Lösungen** im **Bildungssektor**.",
      "Die **geringe Fallzahl** mahnt zur **Vorsicht** bei der Interpretation."
    ],
    "method": "Quartalsvergleich der prozentualen Veränderung (pp) einer Kombination mit der des Gesamtmarktes."
  }
}`,
    bd_primary_bench: `{
  "schema": { "type": "bd_benchmark_list" },
  "YTD": {
    "header": {
      "title": "Primär-KI – Leistungsprofil (vs. Gesamt)",
      "detail": "Halbjahr 1 2025 vs. Halbjahr 1 2024"
    },
    "items": [
       {
        "title": "Primär – Beratung/Unterstützung",
        "delta_vs_benchmark_pp": 13.5,
        "focus_delta_pp": 25.1,
        "benchmark_delta_pp": 11.6,
        "confidence": "hoch",
        "evidence": {
          "focus": {
            "current": { "count": 22, "n": 30, "pct": 73.3 },
            "reference": { "count": 14, "n": 29, "pct": 48.2 }
          },
          "benchmark": {
            "current": { "count": 80, "n": 115, "pct": 69.6 },
            "reference": { "count": 47, "n": 81, "pct": 58.0 }
          }
        }
      },
      {
        "title": "Primär – Training & Enablement",
        "delta_vs_benchmark_pp": 12.3,
        "focus_delta_pp": 11.1,
        "benchmark_delta_pp": -1.2,
        "confidence": "mittel",
        "evidence": {
          "focus": {
            "current": { "count": 8, "n": 30, "pct": 26.7 },
            "reference": { "count": 4, "n": 29, "pct": 15.6 }
          },
          "benchmark": {
            "current": { "count": 27, "n": 115, "pct": 23.5 },
            "reference": { "count": 20, "n": 81, "pct": 24.7 }
          }
        }
      },
      {
        "title": "Primär – Betrieb & Wartung",
        "delta_vs_benchmark_pp": 3.8,
        "focus_delta_pp": 22.5,
        "benchmark_delta_pp": 18.7,
        "confidence": "hoch",
        "evidence": {
          "focus": {
            "current": { "count": 14, "n": 30, "pct": 46.7 },
            "reference": { "count": 7, "n": 29, "pct": 24.2 }
          },
          "benchmark": {
            "current": { "count": 47, "n": 115, "pct": 40.9 },
            "reference": { "count": 18, "n": 81, "pct": 22.2 }
          }
        }
      }
    ],
    "interpretation": [
      "**Primär-KI-Projekte** werden signifikant häufiger von **Beratung und Enablement begleitet** als der Marktdurchschnitt.",
      "Dies deutet auf einen **höheren strategischen und transformativen Charakter** dieser Vorhaben hin."
    ],
    "method": "Vergleich der Anteilsveränderung (pp) von Leistungen innerhalb des Primär-KI-Clusters mit der Veränderung im Gesamtmarkt."
  },
   "QoQ": { "header": { "title": "Primär-KI – Leistungsprofil (vs. Gesamt)", "detail": "Quartal 2 2025 vs. Quartal 1 2025" }, "items": [], "interpretation": ["Keine **signifikanten Abweichungen** im Quartalsvergleich."], "method": "" }
}`,
    bd_rv_bench: `{
  "schema": { "type": "bd_benchmark_list" },
  "YTD": {
    "header": {
      "title": "Rahmenverträge – Leistungsprofil (vs. Nicht-RV)",
      "detail": "Halbjahr 1 2025 vs. Halbjahr 1 2024"
    },
    "items": [
      {
        "title": "Rahmenverträge – Enablement",
        "delta_vs_benchmark_pp": 20.1,
        "focus_delta_pp": 22.6,
        "benchmark_delta_pp": 2.5,
        "confidence": "mittel",
        "evidence": {
          "focus": {
            "current": { "count": 10, "n": 33, "pct": 30.3 },
            "reference": { "count": 1, "n": 13, "pct": 7.7 }
          },
          "benchmark": {
            "current": { "count": 17, "n": 82, "pct": 20.7 },
            "reference": { "count": 15, "n": 68, "pct": 18.2 }
          }
        }
      },
      {
        "title": "Rahmenverträge – KI-Entwicklung",
        "delta_vs_benchmark_pp": -15.4,
        "focus_delta_pp": -25.4,
        "benchmark_delta_pp": -10.0,
        "confidence": "hoch",
        "evidence": {
          "focus": {
            "current": { "count": 17, "n": 33, "pct": 51.5 },
            "reference": { "count": 10, "n": 13, "pct": 76.9 }
          },
          "benchmark": {
            "current": { "count": 65, "n": 82, "pct": 79.3 },
            "reference": { "count": 61, "n": 68, "pct": 89.3 }
          }
        }
      }
    ],
    "interpretation": [
      "**Enablement-Leistungen** gewinnen in Rahmenverträgen **überproportional an Bedeutung**.",
      "**Klassische KI-Entwicklung** verliert zwar überall an Anteil, in Rahmenverträgen ist dieser Rückgang jedoch **besonders stark ausgeprägt**."
    ],
    "method": "Vergleich der Anteilsveränderung (pp) von Leistungen innerhalb von Rahmenverträgen mit der Veränderung bei Nicht-Rahmenverträgen."
  },
  "QoQ": {
    "header": {
      "title": "Rahmenverträge – Leistungsprofil (vs. Nicht-RV)",
      "detail": "Quartal 2 2025 vs. Quartal 1 2025"
    },
    "items": [
      {
        "title": "Rahmenverträge – Datenmanagement",
        "delta_vs_benchmark_pp": 22.5,
        "focus_delta_pp": 25.0,
        "benchmark_delta_pp": 2.5,
        "confidence": "niedrig",
        "evidence": {
          "focus": {
            "current": { "count": 7, "n": 21, "pct": 33.3 },
            "reference": { "count": 1, "n": 12, "pct": 8.3 }
          },
          "benchmark": {
            "current": { "count": 5, "n": 47, "pct": 10.6 },
            "reference": { "count": 2, "n": 35, "pct": 8.1 }
          }
        }
      }
    ],
    "interpretation": ["**Datenmanagement** gewinnt in Rahmenverträgen kurzfristig **stark an Bedeutung**."],
    "method": "Quartalsvergleich der Anteilsveränderung (pp) innerhalb RVs mit Nicht-RVs."
  }
}`
};
// --- ENDE BD DATEN ---

const consultingFocusBeratungRaw = `{
  "card_id": "consulting_focus_beratung",
  "title": "Fokus‑Thema: Beratung & Unterstützung",
  "badge": "Klassifiziert",
  "kpi": {
    "ytd": {
      "label": "Anteil in Halbjahr 1 2025",
      "value_percent": 69.6,
      "delta_pp": 11.6,
      "direction": "up",
      "counts": {
        "current": {
          "numerator": 80,
          "denominator": 115,
          "label": "Halbjahr 1 2025"
        },
        "ref": {
          "numerator": 47,
          "denominator": 81,
          "label": "Halbjahr 1 2024"
        }
      }
    },
    "qoq": {
      "label": "Anteil in Quartal 2 2025",
      "value_percent": 69.1,
      "delta_pp": -1.1,
      "direction": "down",
      "counts": {
        "current": {
          "numerator": 47,
          "denominator": 68,
          "label": "Quartal 2 2025"
        },
        "ref": {
          "numerator": 33,
          "denominator": 47,
          "label": "Quartal 1 2025"
        }
      }
    }
  },
  "interpretation": {
    "ytd": [
      "**Beratung & Unterstützung** gewinnt im **Jahresvergleich** an **Bedeutung**.",
      "Das Muster passt zu einer Phase, in der **Planung**, **Enablement** und **Begleitung** breit nachgefragt werden."
    ],
    "qoq": [
      "Kurzfristig weitgehend **stabil**; nach starkem Q1 zeigt sich ein **leichter Rückgang**.",
      "Die **Nachfrage bleibt hoch**, ohne Richtungswechsel."
    ]
  },
  "methodology": [
    "Leistung per LLM aus Ausschreibungstexten klassifiziert (Mehrfachnennungen möglich).",
    "Anteil = Anzahl der Vergaben mit dieser Leistung ÷ Anzahl aller Vergaben je Periode.",
    "YTD vergleicht Halbjahr 1 2025 mit Halbjahr 1 2024 (Q1+Q2).",
    "QoQ vergleicht Quartal 2 2025 mit Quartal 1 2025."
  ]
}`;

const consultingFocusBranchesRaw = `{
  "card_type": "consulting_focus_beratung_branches",
  "title": "Fokus‑Thema: Beratung – Branchen‑Spotlights (vs. Markt)",
  "subtitle_yoy": "Abweichung zur Marktveränderung (H1 2025 vs. H1 2024)",
  "subtitle_qoq": "Abweichung zur Marktveränderung (Q2 2025 vs. Q1 2025)",
  "yoy": {
    "market_change_pp": 11.5,
    "items": [
      {
        "label": "Öffentliche Verwaltung – Beratung/Unterstützung",
        "delta_vs_market_pp": 12.0,
        "branch_change_pp": 23.6,
        "market_change_pp": 11.5,
        "share_curr_pct": 76.9,
        "basis_text": "Basis: n=39 (aktuell), n=30 (Referenz)",
        "confidence": "Hoch",
        "counts": {
          "current": {
            "consulting": 30,
            "total": 39
          },
          "reference": {
            "consulting": 16,
            "total": 30
          }
        }
      }
    ]
  },
  "qoq": {
    "market_change_pp": -1.1,
    "items": [
      {
        "label": "Gesundheitswesen – Beratung/Unterstützung",
        "delta_vs_market_pp": -32.7,
        "branch_change_pp": -33.8,
        "market_change_pp": -1.1,
        "share_curr_pct": 57.1,
        "basis_text": "Basis: n=7 (aktuell), n=11 (Referenz)",
        "confidence": "Niedrig",
        "counts": {
          "current": {
            "consulting": 4,
            "total": 7
          },
          "reference": {
            "consulting": 10,
            "total": 11
          }
        }
      },
      {
        "label": "Bildung und Forschung – Beratung/Unterstützung",
        "delta_vs_market_pp": 14.9,
        "branch_change_pp": 13.8,
        "market_change_pp": -1.1,
        "share_curr_pct": 53.8,
        "basis_text": "Basis: n=13 (aktuell), n=5 (Referenz)",
        "confidence": "Niedrig",
        "counts": {
          "current": {
            "consulting": 7,
            "total": 13
          },
          "reference": {
            "consulting": 2,
            "total": 5
          }
        }
      },
      {
        "label": "Öffentliche Verwaltung – Beratung/Unterstützung",
        "delta_vs_market_pp": -1.5,
        "branch_change_pp": -2.6,
        "market_change_pp": -1.1,
        "share_curr_pct": 76.0,
        "basis_text": "Basis: n=25 (aktuell), n=14 (Referenz)",
        "confidence": "Mittel",
        "counts": {
          "current": {
            "consulting": 19,
            "total": 25
          },
          "reference": {
            "consulting": 11,
            "total": 14
          }
        }
      }
    ]
  }
}`;

const consultingProfilesRaw = `{
  "card_id": "consulting_profiles",
  "title": "Gefragte Consulting‑Profile",
  "design_like": "Fokus‑Thema: Chatbot",
  "ytd": {
    "period_label": "Halbjahr 1 2025 vs. Halbjahr 1 2024",
    "top_items": [
      {
        "profile": "KI‑Projektmanager",
        "current": {
          "count": 64,
          "of": 115,
          "share_pct": 55.7
        },
        "previous": {
          "count": 37,
          "of": 81,
          "share_pct": 45.7
        },
        "delta_prozentpunkte": 10.0
      },
      {
        "profile": "AI-Consultant",
        "current": {
          "count": 48,
          "of": 115,
          "share_pct": 41.7
        },
        "previous": {
          "count": 32,
          "of": 81,
          "share_pct": 39.5
        },
        "delta_prozentpunkte": 2.3
      },
      {
        "profile": "Business Analyst",
        "current": {
          "count": 41,
          "of": 115,
          "share_pct": 35.7
        },
        "previous": {
          "count": 24,
          "of": 81,
          "share_pct": 29.6
        },
        "delta_prozentpunkte": 6.0
      },
      {
      "profile": "Data Scientist",
      "current": {
        "count": 29,
        "of": 115,
        "share_pct": 25.2
      },
      "previous": {
        "count": 23,
        "of": 81,
        "share_pct": 28.4
      },
      "delta_prozentpunkte": -3.2
    },
      {
        "profile": "Compliance‑Experte",
        "current": {
          "count": 17,
          "of": 115,
          "share_pct": 14.8
        },
        "previous": {
          "count": 5,
          "of": 81,
          "share_pct": 6.2
        },
        "delta_prozentpunkte": 8.6
      }
    ],
    "interpretation": [
      "**Projektmanagement** dominiert das Anforderungsbild; **Business-Analyse** legt **spürbar zu**.",
      "**Compliance** gewinnt an Sichtbarkeit, bleibt aber klar **nachgeordnet**."
    ],
    "methodik_hinweise": [
      "Anteil je Profil bezogen auf alle Ausschreibungen der Periode (Mehrfachnennung möglich).",
      "Profilzuordnung aus LLM‑Klassifizierung → Orientierung, defensiv lesen.",
      "YTD = Q1+Q2 je Jahr."
    ]
  },
  "qoq": {
    "period_label": "Quartal 2 2025 vs. Quartal 1 2025",
    "top_items": [
      {
        "profile": "KI‑Projektmanager",
        "current": {
          "count": 39,
          "of": 68,
          "share_pct": 57.4
        },
        "previous": {
          "count": 25,
          "of": 47,
          "share_pct": 53.2
        },
        "delta_prozentpunkte": 4.2
      },
      {
        "profile": "Business Analyst",
        "current": {
          "count": 27,
          "of": 68,
          "share_pct": 39.7
        },
        "previous": {
          "count": 14,
          "of": 47,
          "share_pct": 29.8
        },
        "delta_prozentpunkte": 9.9
      },
      {
  "profile": "AI Consultant",
  "current": {
    "count": 26,
    "of": 68,
    "share_pct": 38.2
  },
  "previous": {
    "count": 22,
    "of": 47,
    "share_pct": 46.8
  },
  "delta_prozentpunkte": -8.6
},
      {
        "profile": "Compliance‑Experte",
        "current": {
          "count": 14,
          "of": 68,
          "share_pct": 20.6
        },
        "previous": {
          "count": 3,
          "of": 47,
          "share_pct": 6.4
        },
        "delta_prozentpunkte": 14.2
      },
      {
  "profile": "Data Scientist",
  "current": {
    "count": 13,
    "of": 68,
    "share_pct": 19.1
  },
  "previous": {
    "count": 16,
    "of": 47,
    "share_pct": 34.0
  },
  "delta_prozentpunkte": -14.9
}
    ],
    "interpretation": [
      "**Kurzfristig** zieht die Nachfrage nach **Business-Analyse** und **Compliance an**; **Projektmanagement** bleibt **vorne**."
    ],
    "methodik_hinweise": [
      "Anteil je Profil bezogen auf alle Ausschreibungen der Periode (Mehrfachnennung möglich).",
      "Profilzuordnung aus LLM‑Klassifizierung → Orientierung, defensiv lesen."
    ]
  }
}`;

const implementationDataYoYRaw = `{
  "cards": [
    {
      "id": "impl_ops_yoy",
      "title": "Betrieb & Wartung – Top-Entwicklungen (vs. Ø Markt)",
      "compare": "Halbjahr 1 2025 vs. Halbjahr 1 2024",
      "market_change_prozentpunkte": 18.6,
      "sections": [
        {
          "subtitle": "Regionen",
          "items": [
            {
              "label": "Region – Bund",
              "delta_vs_markt_prozentpunkte": 2.5,
              "fokus_change_prozentpunkte": 21.2,
              "aktuell_anteil_prozent": 25.9,
              "vorjahr_anteil_prozent": 4.8,
              "basis": "n: 21→27",
              "confidence": "Mittel"
            },
            {
              "label": "Region – Nordrhein-Westfalen",
              "delta_vs_markt_prozentpunkte": -13.9,
              "fokus_change_prozentpunkte": 4.8,
              "aktuell_anteil_prozent": 19.0,
              "vorjahr_anteil_prozent": 14.3,
              "basis": "n: 14→21",
              "confidence": "Mittel"
            }
          ]
        },
        {
          "subtitle": "Branchen",
          "items": [
            {
              "label": "Branche – Öffentliche Verwaltung",
              "delta_vs_markt_prozentpunkte": 5.7,
              "fokus_change_prozentpunkte": 22.8,
              "aktuell_anteil_prozent": 36.0,
              "vorjahr_anteil_prozent": 13.2,
              "basis": "n: 30→39",
              "confidence": "Hoch"
            }
          ]
        }
      ],
      "interpretation": [
        "**Betrieb & Wartung** legt **breit zu**; die **Öffentliche Verwaltung** treibt den Trend.",
        "Auf **Bundesebene über Markt**, **Nordrhein-Westfalen unter Markt**."
      ],
      "methodik": "Anteil je Gruppe (Region/Branche) = count(Leistung∈{Betrieb & Wartung})/n; Δ vs. Markt = (Gruppen-Δ) − (Markt-Δ). Basis: H1 (Q1+Q2)."
    },
    {
      "id": "impl_platform_yoy",
      "title": "Software- / Plattformentwicklung – Top-Entwicklungen (vs. Ø Markt)",
      "compare": "Halbjahr 1 2025 vs. Halbjahr 1 2024",
      "market_change_prozentpunkte": -3.1,
      "sections": [
        {
          "subtitle": "Regionen",
          "items": [
            {
              "label": "Region – Bund",
              "delta_vs_markt_prozentpunkte": 2.1,
              "fokus_change_prozentpunkte": -1.0,
              "aktuell_anteil_prozent": 40.7,
              "vorjahr_anteil_prozent": 41.7,
              "basis": "n: 21→27",
              "confidence": "Mittel"
            }
          ]
        },
        {
          "subtitle": "Branchen",
          "items": [
            {
              "label": "Branche – Öffentliche Verwaltung",
              "delta_vs_markt_prozentpunkte": 4.1,
              "fokus_change_prozentpunkte": 0.2,
              "aktuell_anteil_prozent": 49.3,
              "vorjahr_anteil_prozent": 49.1,
              "basis": "n: 30→39",
              "confidence": "Hoch"
            }
          ]
        }
      ],
      "interpretation": [
        "**Plattformanteile** sind **leicht rückläufig**; die **Öffentliche Verwaltung** hält sich **besser als der Markt**.",
        "Der **Bund** zeigt eine **milde Outperformance** bei insgesamt stabilem Niveau."
      ],
      "methodik": "Wie oben; Leistung = Plattformentwicklung."
    }
  ]
}`;

const implementationDataQoQRaw = `{
  "cards": [
    {
      "id": "impl_ops_qoq",
      "title": "Betrieb & Wartung – Top-Entwicklungen (vs. Ø Markt)",
      "compare": "Quartal 2 2025 vs. Quartal 1 2025",
      "market_change_prozentpunkte": 7.9,
      "sections": [
        {
          "subtitle": "Regionen",
          "items": [
            {
              "label": "Region – Bund",
              "delta_vs_markt_prozentpunkte": 4.6,
              "fokus_change_prozentpunkte": 12.5,
              "aktuell_anteil_prozent": 20.0,
              "vorjahr_anteil_prozent": 7.5,
              "basis": "n: 12→15",
              "confidence": "Niedrig"
            }
          ]
        },
        {
          "subtitle": "Branchen",
          "items": [
            {
              "label": "Branche – Öffentliche Verwaltung",
              "delta_vs_markt_prozentpunkte": 8.5,
              "fokus_change_prozentpunkte": 16.5,
              "aktuell_anteil_prozent": 36.0,
              "vorjahr_anteil_prozent": 19.5,
              "basis": "n: 14→25",
              "confidence": "Mittel"
            }
          ]
        }
      ],
      "interpretation": [
        "**Kurzfristig** setzt sich der **Aufwärtsimpuls** fort; **Öffentliche Verwaltung über Markt**.",
        "Der **Bund** zeigt eine **zusätzliche Belebung** – Aussage vorsichtig lesen (**kleine Basis**)."
      ],
      "methodik": "Wie YoY, aber Q2 vs. Q1 2025."
    },
    {
      "id": "impl_platform_qoq",
      "title": "Software- / Plattformentwicklung – Top-Entwicklungen (vs. Ø Markt)",
      "compare": "Quartal 2 2025 vs. Quartal 1 2025",
      "market_change_prozentpunkte": -6.1,
      "sections": [
        {
          "subtitle": "Regionen",
          "items": [
            {
              "label": "Region – Bund",
              "delta_vs_markt_prozentpunkte": 1.1,
              "fokus_change_prozentpunkte": -5.0,
              "aktuell_anteil_prozent": 20.0,
              "vorjahr_anteil_prozent": 25.0,
              "basis": "n: 12→15",
              "confidence": "Niedrig"
            }
          ]
        },
        {
          "subtitle": "Branchen",
          "items": [
            {
              "label": "Branche – Öffentliche Verwaltung",
              "delta_vs_markt_prozentpunkte": 6.4,
              "fokus_change_prozentpunkte": 0.3,
              "aktuell_anteil_prozent": 36.0,
              "vorjahr_anteil_prozent": 35.7,
              "basis": "n: 14→25",
              "confidence": "Niedrig"
            }
          ]
        }
      ],
      "interpretation": [
        "**Plattformanteile geben im Quartal nach**; die **Öffentliche Verwaltung** hält sich **relativ besser als der Markt**.",
        "Region **Bund** leicht **über Markt**, aber auf **niedriger Datenbasis**."
      ],
      "methodik": "Wie YoY, aber Q2 vs. Q1 2025."
    }
  ]
}`;

const transformBranchDataForBenchmark = (items: any[]) => {
    return items.map(item => {
        const focusCurrentPct = (item.counts.current.total > 0) ? (item.counts.current.consulting / item.counts.current.total) * 100 : 0;
        const focusReferencePct = (item.counts.reference.total > 0) ? (item.counts.reference.consulting / item.counts.reference.total) * 100 : 0;

        return {
            title: item.label,
            delta_vs_benchmark_pp: item.delta_vs_market_pp,
            focus_delta_pp: item.branch_change_pp,
            benchmark_delta_pp: item.market_change_pp,
            confidence: item.confidence.toLowerCase(),
            evidence: {
                focus: { 
                    current: { 
                        count: item.counts.current.consulting, 
                        n: item.counts.current.total, 
                        pct: focusCurrentPct
                    },
                    reference: {
                        count: item.counts.reference.consulting,
                        n: item.counts.reference.total,
                        pct: focusReferencePct
                    }
                },
                benchmark: undefined 
            }
        };
    });
};

const transformImplementationDataForBenchmark = (card: any): TopInsight => {
    const flattenedItems = card.sections.flatMap((section: any) => 
        section.items.map((item: any) => {
            const basisMatch = item.basis.match(/n:\s*(\d+)\s*→\s*(\d+)/);
            const nRef = basisMatch ? parseInt(basisMatch[1], 10) : 0;
            const nCurr = basisMatch ? parseInt(basisMatch[2], 10) : 0;
            
            const pctCurr = item.aktuell_anteil_prozent;
            const pctRef = item.vorjahr_anteil_prozent;

            return {
                title: item.label,
                delta_vs_benchmark_pp: item.delta_vs_markt_prozentpunkte,
                focus_delta_pp: item.fokus_change_prozentpunkte,
                benchmark_delta_pp: card.market_change_prozentpunkte,
                confidence: item.confidence.toLowerCase(),
                evidence: {
                    focus: {
                        current: {
                            count: Math.round((pctCurr / 100) * nCurr),
                            n: nCurr,
                            pct: pctCurr,
                        },
                        reference: {
                            count: Math.round((pctRef / 100) * nRef),
                            n: nRef,
                            pct: pctRef,
                        }
                    },
                }
            };
        })
    );
    
    const newMethodology = "Branche/Region: Vergleicht die Veränderung der Leistung mit dem Durchschnitt aller Branchen bzw. aller Regionen derselben Periode (zeigt Über-/Unterdurchschnitt)";

    return {
        id: card.id.replace(/_yoy|_qoq/g, ''),
        title: card.title,
        subtitle: card.compare,
        value: 0, // Not used for the main KPI display of this card type
        delta: card.market_change_prozentpunkte / 100, // Used for the main KPI display
        valueType: 'share', // Not used
        deltaType: 'pp', // Correct for formatting
        provenance: 'klassifiziert',
        detailData: {
            header: {
                title: card.title,
                detail: card.compare,
            },
            items: flattenedItems,
            interpretation: card.interpretation,
            method: newMethodology
        }
    };
};


export const useData = (deltaView: DeltaView) => {
    const [generalInsightsData, setGeneralInsightsData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch is relative to the root HTML file (index.html)
        fetch('./data/q3_2025_general_insights.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setGeneralInsightsData(data);
            })
            .catch(e => {
                console.error("Fehler beim Laden der JSON-Daten:", e);
                setError(e instanceof Error ? e.message : String(e));
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const result = useMemo(() => {
        if (!generalInsightsData) {
            return { data: null, processingError: null };
        }

        try {
            // --- GENERAL INSIGHTS ---
            const generalInsights = deltaView === 'YoY' ? generalInsightsData.YTD : generalInsightsData.QoQ;
            const {
                executiveSummaryPoints,
                topInsights,
                otherInsights,
                currentPeriodLabel,
                previousPeriodLabel
            } = generalInsights;

            const quarterToUse = '2025Q3';
            const firstQuarter = '2024Q1';
            const isTargetQuarterAvailable = true;
            
            // --- OTHER TABS (unchanged logic) ---
            let implementierungData: TopInsight[] = [];
             const structuredExecutiveSummaries = {
                implementierung: {
                    yoy: [
                        { title: 'Betrieb & Wartung', description: staticExecutiveSummaries.implementierung.yoy[0], icon: 'settings' },
                        { title: 'Plattformentwicklung', description: staticExecutiveSummaries.implementierung.yoy[1], icon: 'code' },
                        { title: 'Marktreife', description: staticExecutiveSummaries.implementierung.yoy[2], icon: 'graph' },
                        { title: 'Tool-Spezifität', description: staticExecutiveSummaries.implementierung.yoy[3], icon: 'tool' },
                    ],
                    qoq: [
                        { title: 'Betrieb & Wartung', description: staticExecutiveSummaries.implementierung.qoq[0], icon: 'settings' },
                        { title: 'Plattformentwicklung', description: staticExecutiveSummaries.implementierung.qoq[1], icon: 'code' },
                        { title: 'Konsolidierungsphase', description: staticExecutiveSummaries.implementierung.qoq[2], icon: 'graph' },
                        { title: 'Tool-Spezifität', description: staticExecutiveSummaries.implementierung.qoq[3], icon: 'tool' },
                    ]
                },
                consulting: {
                    yoy: [
                        { title: 'Nachfrage Beratung', description: staticExecutiveSummaries.consulting.yoy[0], icon: 'users' },
                        { title: 'Wettbewerbsintensität', description: staticExecutiveSummaries.consulting.yoy[1], icon: 'trending-down' },
                        { title: 'Branchenfokus', description: staticExecutiveSummaries.consulting.yoy[2], icon: 'building' },
                    ],
                    qoq: [
                        { title: 'Nachfrage Beratung', description: staticExecutiveSummaries.consulting.qoq[0], icon: 'users' },
                        { title: 'Wettbewerbsintensität', description: staticExecutiveSummaries.consulting.qoq[1], icon: 'trending-down' },
                        { title: 'Branchen-Dynamik', description: staticExecutiveSummaries.consulting.qoq[2], icon: 'building' },
                        { title: 'Gefragte Profile', description: staticExecutiveSummaries.consulting.qoq[3], icon: 'user-circle' },
                    ]
                },
                bd: {
                    yoy: [
                        { title: 'Fokus-Thema: Chatbot', description: staticExecutiveSummaries.bd.yoy[0], icon: 'chat' },
                        { title: 'Wettbewerbsintensität', description: staticExecutiveSummaries.bd.yoy[1], icon: 'trending-down' },
                        { title: 'Professionalisierung (Primär-KI)', description: staticExecutiveSummaries.bd.yoy[2], icon: 'robot' },
                        { title: 'Wertschöpfung (Rahmenverträge)', description: staticExecutiveSummaries.bd.yoy[3], icon: 'file' },
                        { title: 'Branchenfokus', description: staticExecutiveSummaries.bd.yoy[4], icon: 'building' },
                    ],
                    qoq: [
                         { title: 'Leistungs-Mix', description: staticExecutiveSummaries.bd.qoq[0], icon: 'settings' },
                         { title: 'Fokus-Thema: Chatbot', description: staticExecutiveSummaries.bd.qoq[1], icon: 'chat' },
                         { title: 'Wettbewerbsintensität', description: staticExecutiveSummaries.bd.qoq[2], icon: 'trending-down' },
                         { title: 'Wissens-Transfer (Primär-KI)', description: staticExecutiveSummaries.bd.qoq[3], icon: 'robot' },
                         { title: 'Daten-Fokus (Rahmenverträge)', description: staticExecutiveSummaries.bd.qoq[4], icon: 'file' },
                         { title: 'Branchenfokus', description: staticExecutiveSummaries.bd.qoq[5], icon: 'building' },
                    ]
                }
            };

            if (deltaView === 'YoY') {
                const implementationDataRaw = JSON.parse(implementationDataYoYRaw);
                implementierungData = implementationDataRaw.cards.map(transformImplementationDataForBenchmark);

            } else { // QoQ view
                const implementationDataRaw = JSON.parse(implementationDataQoQRaw);
                implementierungData = implementationDataRaw.cards.map(transformImplementationDataForBenchmark);
            }

            const consultingFocusData = JSON.parse(consultingFocusBeratungRaw);
            const consultingFocusInsight: TopInsight = {
                id: consultingFocusData.card_id,
                title: consultingFocusData.title,
                provenance: consultingFocusData.badge.toLowerCase() as PillType,
                valueType: 'share',
                deltaType: 'pp',
                subtitle: '',
                value: 0,
                delta: 0,
                detailData: {},
                calculationNote: consultingFocusData.methodology.join(' '),
            };

            if (deltaView === 'YoY') {
                const ytdData = consultingFocusData.kpi.ytd;
                consultingFocusInsight.subtitle = ytdData.label;
                consultingFocusInsight.value = ytdData.value_percent / 100;
                consultingFocusInsight.delta = ytdData.delta_pp / 100;
                
                const ref_pct_ytd = (ytdData.counts.ref.denominator > 0) ? (ytdData.counts.ref.numerator / ytdData.counts.ref.denominator) * 100 : 0;
                const mini_bars_ytd = [
                    { label: ytdData.counts.ref.label, median_pct: ref_pct_ytd, n: ytdData.counts.ref.denominator },
                    { label: ytdData.counts.current.label, median_pct: ytdData.value_percent, n: ytdData.counts.current.denominator }
                ];
                
                consultingFocusInsight.detailData = {
                    ...ytdData,
                    interpretation: consultingFocusData.interpretation.ytd,
                    methodology: consultingFocusData.methodology,
                    mini_bars: mini_bars_ytd
                };
            } else { // QoQ
                const qoqData = consultingFocusData.kpi.qoq;
                consultingFocusInsight.subtitle = qoqData.label;
                consultingFocusInsight.value = qoqData.value_percent / 100;
                consultingFocusInsight.delta = qoqData.delta_pp / 100;
                
                const ref_pct_qoq = (qoqData.counts.ref.denominator > 0) ? (qoqData.counts.ref.numerator / qoqData.counts.ref.denominator) * 100 : 0;
                const mini_bars_qoq = [
                    { label: qoqData.counts.ref.label, median_pct: ref_pct_qoq, n: qoqData.counts.ref.denominator },
                    { label: qoqData.counts.current.label, median_pct: qoqData.value_percent, n: qoqData.counts.current.denominator }
                ];

                consultingFocusInsight.detailData = {
                    ...qoqData,
                    interpretation: consultingFocusData.interpretation.qoq,
                    methodology: consultingFocusData.methodology,
                    mini_bars: mini_bars_qoq
                };
            }

            const consultingBranchesData = JSON.parse(consultingFocusBranchesRaw);
            const rawBranchDetailData = deltaView === 'YoY' ? consultingBranchesData.yoy : consultingBranchesData.qoq;
            const transformedBranchItems = transformBranchDataForBenchmark(rawBranchDetailData.items);
            
            let branchInterpretation: string[] = [];
            if (deltaView === 'YoY') {
                branchInterpretation = [
                    "Die **Nachfrage nach Beratung** in der **Öffentlichen Verwaltung** wächst **deutlich über dem Markttrend**."
                ];
            } else {
                 branchInterpretation = [
                    "Im **Gesundheitswesen** kühlt die Nachfrage **stark ab**, während **Bildung & Forschung** **deutlich dynamischer** wächst als der Markt.",
                    "Die **Datenbasis** ist teils **gering**, daher ist eine **vorsichtige Interpretation** geboten (siehe 'Confidence')."
                 ];
            }

            const transformedBranchDetailData = {
                header: {
                    title: consultingBranchesData.title,
                    detail: deltaView === 'YoY' ? consultingBranchesData.subtitle_yoy : consultingBranchesData.subtitle_qoq,
                },
                items: transformedBranchItems,
                interpretation: branchInterpretation,
                method: "Vergleich der prozentualen Veränderung (pp) einer Branchen-Beratungs-Kombination mit der Veränderung des Beratungs-Anteils im Gesamtmarkt."
            };
            const consultingBranchesInsight: TopInsight = {
                id: consultingBranchesData.card_type,
                title: consultingBranchesData.title,
                subtitle: transformedBranchDetailData.header.detail,
                provenance: 'klassifiziert',
                value: 0,
                delta: 0,
                valueType: 'share',
                deltaType: 'pp',
                detailData: transformedBranchDetailData,
            };

            const consultingProfilesData = JSON.parse(consultingProfilesRaw);
            const profilesDataForView = deltaView === 'YoY' ? consultingProfilesData.ytd : consultingProfilesData.qoq;
            const topProfile = profilesDataForView.top_items[0];

            const [currentPeriodLabelFromProfile, refPeriodLabel] = profilesDataForView.period_label.split(' vs. ');
            
            const profileBars = profilesDataForView.top_items.map((item: any) => ({
                label: item.profile,
                value_pct: item.current.share_pct,
                delta_pp: item.delta_prozentpunkte,
                detail_current: `${item.current.count}/${item.current.of} in ${currentPeriodLabelFromProfile.trim()}`,
                detail_ref: `${item.previous.count}/${item.previous.of} in ${refPeriodLabel.trim()}`,
            }));

            const consultingProfilesInsight: TopInsight = {
                id: consultingProfilesData.card_id,
                title: consultingProfilesData.title,
                subtitle: topProfile.profile,
                provenance: 'klassifiziert',
                value: topProfile.current.share_pct / 100,
                delta: topProfile.delta_prozentpunkte / 100,
                valueType: 'share',
                deltaType: 'pp',
                detailData: {
                    bars: profileBars,
                    interpretation: profilesDataForView.interpretation,
                },
                calculationNote: profilesDataForView.methodik_hinweise.join(' '),
            };
            
            const implementationToolsData = JSON.parse(implementationToolsRaw);
            if (implementationToolsData) {
                const dataForView = deltaView === 'YoY' ? implementationToolsData.cards.YoY : implementationToolsData.cards.QoQ;
            
                const progData = dataForView.programmier.specific_tool;
                const hostData = dataForView.hosting.specific_tool;
            
                const dumbbellData = [
                    {
                        label: 'Programmiersprachen',
                        ytd_2024_pct: progData.from_pct,
                        ytd_2025_pct: progData.to_pct,
                        n_2024: dataForView.programmier.sample_sizes?.ytd_2024_total,
                        n_2025: dataForView.programmier.sample_sizes?.ytd_2025_total,
                    },
                    {
                        label: 'Hosting',
                        ytd_2024_pct: hostData.from_pct,
                        ytd_2025_pct: hostData.to_pct,
                        n_2024: dataForView.hosting.sample_sizes?.ytd_2024_total,
                        n_2025: dataForView.hosting.sample_sizes?.ytd_2025_total,
                    }
                ];
            
                const progSample = dataForView.programmier.sample_sizes;
                const hostSample = dataForView.hosting.sample_sizes;
                
                const interpretationYoY = [
                    "**Spezifische Hosting-Tools** werden im Jahresvergleich **häufiger** genannt (+15.4 pp). Der Datenbasis bleibt jedoch extrem gering und kaum interpretierbar.",
                    "Bei **Programmiersprachen** ist der Anteil spezifischer Nennungen **leicht rückläufig**.",
                    `Basis (Vergaben mit Kategorie): H1 24: n=${hostSample?.ytd_2024_total} (Host), n=${progSample?.ytd_2024_total} (Prog); H1 25: n=${hostSample?.ytd_2025_total} (Host), n=${progSample?.ytd_2025_total} (Prog)`
                ];
                
                const interpretationQoQ = [
                    "Kurzfristig nimmt die Nennung **spezifischer Programmiersprachen** zu (+6.6 pp). Der Datenbestand bleibt jedoch zu gering für konkrete Schlußfolgerungen",
                    "Im **Hosting-Bereich** nimmt die Spezifität leicht ab; die Nachfrage bleibt auf einem hohen Niveau **Tool-agnostisch**.",
                    "Hinweis: Quartalsvergleiche basieren auf einer kleineren Fallzahl und sind volatiler als YTD-Analysen."
                ];
            
                const toolsInsight: TopInsight = {
                    id: 'impl_tools',
                    title: 'Tool-Spezifität',
                    subtitle: 'Anteil mit konkreter Tool-Nennung',
                    value: progData.to_pct / 100,
                    delta: progData.delta_pp / 100,
                    valueType: 'share',
                    deltaType: 'pp',
                    provenance: 'klassifiziert',
                    detailData: {
                        dumbbell: dumbbellData,
                        interpretation: deltaView === 'YoY' ? interpretationYoY : interpretationQoQ,
                        method: `Analyse der Nennungshäufigkeit von spezifischen Tools vs. generischen Kategorien in Ausschreibungstexten (LLM-klassifiziert). Granularität auf Kategorie-Ebene.`,
                        header: {
                            title: "Tool-Spezifität",
                            value_pct: progData.to_pct,
                            delta_pp: progData.delta_pp,
                            detail: deltaView === 'YoY' 
                                ? 'H1/2025 vs. H1/2024' 
                                : 'Q2/2025 vs. Q1/2025',
                        },
                    }
                };
                if(implementierungData && toolsInsight) {
                    implementierungData.push(toolsInsight);
                }
            }


            const bdZuschlagData = JSON.parse(bdRawData.bd_zuschlag_card);
            if (deltaView === 'QoQ') {
                bdZuschlagData.QoQ.method = 'Kennzahl: Median des Preis-Anteils je Quartal (robust gegen Ausreißer). Vergleich: Q2 2025 vs. Q1 2025; nur Vergaben mit verfügbaren Gewichtungen. Nicht alle Vergaben enthalten Zuschlags-Gewichtungen; Streuung je Quartal kann variieren.';
            }
            const zuschlagDataForView = deltaView === 'YoY' ? bdZuschlagData.YTD : bdZuschlagData.QoQ;
            const zuschlagInsight: TopInsight = {
                id: 'bd_award',
                title: bdZuschlagData.schema.title,
                subtitle: zuschlagDataForView.header.detail,
                value: zuschlagDataForView.header.value_pct / 100,
                delta: zuschlagDataForView.header.delta_pp / 100,
                valueType: 'share',
                deltaType: 'pp',
                provenance: 'faktisch',
                detailData: zuschlagDataForView,
            };
            
            const businessDevelopmentData = {
                executiveSummaryPoints: deltaView === 'YoY' ? structuredExecutiveSummaries.bd.yoy : structuredExecutiveSummaries.bd.qoq,
                insights: (() => {
                    const insightsList: TopInsight[] = [];

                    const bdChatbotData = JSON.parse(bdRawData.bd_chatbot_card);
                    // Chatbot Card
                    const chatbotDataForView = deltaView === 'YoY' ? bdChatbotData.YTD : bdChatbotData.QoQ;
                    if (chatbotDataForView) {
                         const parseDetail = (detailString: string): { count: number; n: number } => {
                            const match = detailString.match(/(\d+)\/(\d+)/);
                            if (match) {
                                return { count: parseInt(match[1], 10), n: parseInt(match[2], 10) };
                            }
                            return { count: 0, n: 0 };
                         };

                        const total_n_current = deltaView === 'YoY' ? 115 : 68;
                        const total_n_previous = deltaView === 'YoY' ? 81 : 47;

                        const overallCurrentCount = chatbotDataForView.bars.reduce((acc: number, bar: any) => acc + parseDetail(bar.detail_current).count, 0);
                        const overallRefCount = chatbotDataForView.bars.reduce((acc: number, bar: any) => acc + parseDetail(bar.detail_ref).count, 0);

                        const rateCurrent = total_n_current > 0 ? overallCurrentCount / total_n_current : 0;
                        const rateRef = total_n_previous > 0 ? overallRefCount / total_n_previous : 0;
                        const delta = rateCurrent - rateRef;

                        const periodLabelCurrent = deltaView === 'YoY' ? 'Halbjahr 1 2025' : 'Quartal 2 2025';

                        const newHeader = {
                            title: "Gesamtanteil Chatbot-Themen",
                            value_pct: rateCurrent * 100,
                            delta_pp: delta * 100,
                            detail: `${overallCurrentCount}/${total_n_current} in ${periodLabelCurrent}`
                        };

                         const updatedDetailData = { ...chatbotDataForView, header: newHeader };

                         insightsList.push({
                            id: 'bd_chatbot',
                            title: bdChatbotData.schema.title,
                            subtitle: newHeader.title,
                            value: rateCurrent,
                            delta: delta,
                            valueType: 'share',
                            deltaType: 'pp',
                            provenance: 'klassifiziert',
                            detailData: updatedDetailData,
                            calculationNote: bdChatbotData.method
                        });
                    }

                    // Zuschlagskriterien Card
                    insightsList.push(zuschlagInsight);

                    // New Benchmark List Cards
                    const bdBranchData = JSON.parse(bdBenchmarkRawData.bd_branch_bench);
                    const bdPrimaryData = JSON.parse(bdBenchmarkRawData.bd_primary_bench);
                    const bdRvData = JSON.parse(bdBenchmarkRawData.bd_rv_bench);

                    const createBenchmarkInsight = (id: string, data: any): TopInsight => {
                        const dataForView = deltaView === 'YoY' ? data.YTD : data.QoQ;
                        return {
                            id: id,
                            title: dataForView.header.title,
                            subtitle: dataForView.header.detail,
                            value: 0, 
                            delta: 0,
                            valueType: 'share',
                            deltaType: 'pp',
                            provenance: 'klassifiziert',
                            detailData: dataForView,
                        };
                    };

                    insightsList.push(createBenchmarkInsight('bd_branch_bench', bdBranchData));
                    insightsList.push(createBenchmarkInsight('bd_primary_bench', bdPrimaryData));
                    insightsList.push(createBenchmarkInsight('bd_rv_bench', bdRvData));

                    return insightsList;
                })()
            };
            
            const consultingData = {
                executiveSummaryPoints: deltaView === 'YoY' ? structuredExecutiveSummaries.consulting.yoy : structuredExecutiveSummaries.consulting.qoq,
                insights: [consultingFocusInsight, zuschlagInsight, consultingBranchesInsight, consultingProfilesInsight]
            };

            const data = {
                quarter: quarterToUse,
                isTargetQuarterAvailable,
                firstQuarter,
                // General Insights from JSON
                executiveSummaryPoints,
                topInsights,
                otherInsights,
                currentPeriodLabel,
                previousPeriodLabel,
                // Other tabs data
                implementierungData,
                executiveSummaries: structuredExecutiveSummaries,
                businessDevelopmentData,
                consultingData,
            };
            return { data, processingError: null };
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            console.error("Fehler bei der Datenverarbeitung:", e);
            return { data: null, processingError: errorMessage };
        }
    }, [deltaView, generalInsightsData]);
    
    return { data: result.data, loading, error: error || result.processingError };
};