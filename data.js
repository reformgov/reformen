/**
 * ReformGov – Reformdaten
 * ========================
 * Diese Datei zentral pflegen, um Fortschritt und Status zu aktualisieren.
 * Felder:
 *   id        – Ordnername im Repo (für den GitHub-Link)
 *   label     – Anzeigename
 *   icon      – Material Icon Name
 *   progress  – Fortschritt in Prozent (0–100)
 *   status    – "active" | "open" | "done"
 *   updated   – Letztes Update (ISO-Datum)
 */
const REFORMS = [
  {
    id:       "steuerreform",
    label:    "Steuerreform",
    icon:     "payments",
    progress: 5,
    status:   "active",
    updated:  "2026-05-10"
  },
  {
    id:       "krankenversicherung",
    label:    "Krankenversicherung",
    icon:     "health_and_safety",
    progress: 5,
    status:   "active",
    updated:  "2026-05-09"
  },
  {
    id:       "rentenversicherung",
    label:    "Rentenversicherung",
    icon:     "elderly",
    progress: 5,
    status:   "active",
    updated:  "2026-05-08"
  },
  {
    id:       "bildung",
    label:    "Bildungsreform",
    icon:     "school",
    progress: 5,
    status:   "open",
    updated:  "2026-05-01"
  },
  {
    id:       "wohnungsmarkt",
    label:    "Wohnungsmarkt",
    icon:     "apartment",
    progress: 5,
    status:   "open",
    updated:  "2026-05-01"
  },
  {
    id:       "klima-energie",
    label:    "Klima & Energie",
    icon:     "eco",
    progress: 5,
    status:   "open",
    updated:  "2026-05-01"
  },
  {
    id:       "verwaltung",
    label:    "Verwaltung & Digitalisierung",
    icon:     "account_balance",
    progress: 5,
    status:   "open",
    updated:  "2026-05-01"
  }
];

/**
 * Karten-Beschreibungen (für die Cards-Sektion)
 */
const REFORM_DESCRIPTIONS = {
  steuerreform:       "Vereinfachung, Gerechtigkeit und internationale Wettbewerbsfähigkeit des deutschen Steuersystems.",
  krankenversicherung:"Nachhaltige Finanzierung und ein gerechtes Gesundheitssystem für alle – ohne Zwei-Klassen-Medizin.",
  rentenversicherung: "Generationengerechte Altersvorsorge angesichts des demografischen Wandels.",
  bildung:            "Chancengerechtigkeit, Digitalisierung und Exzellenz – von der Kita bis zur Hochschule.",
  wohnungsmarkt:      "Bezahlbares Wohnen, sozialer Wohnungsbau und Eigentumsförderung in Ballungsräumen.",
  "klima-energie":    "Klimaschutz und Energiewende mit wirtschaftlicher Vernunft – Transformation statt Stillstand.",
  verwaltung:         "Bürokratieabbau, E-Government und ein moderner öffentlicher Dienst."
};

const REPO_BASE = "https://github.com/reformgov/reformen/tree/main/reformen";
