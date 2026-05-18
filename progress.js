/**
 * ReformGov – progress.js
 * ========================
 * Berechnet Fortschritt dynamisch aus den README.md-Dateien im GitHub-Repo.
 *
 * Scoring pro Dokument-Zeile in der README-Tabelle:
 *   🔵 Offen        → 0 Punkte
 *   🟡 Entwurf      → 1 Punkt
 *   🟢 Konsolidiert → 2 Punkte
 *
 * progress = (Summe Punkte / Anzahl Docs × 2) × 100
 *
 * Fallback: Wert aus data.js (REFORMS[].progress), wenn API nicht erreichbar.
 */

const GITHUB_API  = "https://api.github.com/repos/reformgov/reformen/contents/reformen";
const GITHUB_RAW  = "https://raw.githubusercontent.com/reformgov/reformen/main/reformen";

/* Status-Emoji → Punkte */
const STATUS_SCORE = {
  "🟢": 2,  // Konsolidiert / Fertig
  "🟡": 1,  // Entwurf / In Diskussion
  "🔵": 0,  // Offen
  "🔴": 0,  // Blockiert
};

/**
 * Liest die README.md eines Reformbereichs und gibt { progress, docCount } zurück.
 */
async function fetchReformProgress(reformId) {
  const url = `${GITHUB_RAW}/${reformId}/README.md`;

  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`README nicht gefunden: ${url}`);

  const text = await res.text();
  return parseReadmeProgress(text);
}

/**
 * Parst die Markdown-Tabelle und extrahiert Fortschritt.
 * Erwartet Tabellen-Zeilen der Form:
 *   | [Dateiname.md](link) | Titel | 🟡 Entwurf |
 */
function parseReadmeProgress(markdown) {
  const lines = markdown.split("\n");

  // Tabellen-Zeilen mit mindestens 3 Spalten und einem bekannten Emoji
  const dataRows = lines.filter(line => {
    const isRow = line.trim().startsWith("|") &&
                  !line.includes("---") &&          // kein Trennstrich
                  !line.toLowerCase().includes("datei") && // kein Header
                  !line.toLowerCase().includes("file");
    return isRow;
  });

  let totalPoints = 0;
  let docCount    = 0;

  for (const row of dataRows) {
    const cols = row.split("|").map(c => c.trim()).filter(Boolean);
    if (cols.length < 2) continue;

    // Status steht in der letzten Spalte
    const statusCol = cols[cols.length - 1];

    let matched = false;
    for (const [emoji, points] of Object.entries(STATUS_SCORE)) {
      if (statusCol.includes(emoji)) {
        totalPoints += points;
        docCount++;
        matched = true;
        break;
      }
    }

    // Fallback: Zeile enthält ".md" → Dokument ohne bekannten Status → offen
    if (!matched && cols[0].includes(".md")) {
      docCount++;
    }
  }

  if (docCount === 0) return { progress: null, docCount: 0 };

  const progress = Math.round((totalPoints / (docCount * 2)) * 100);
  return { progress, docCount, totalPoints };
}

/**
 * Lädt den Fortschritt für alle Reforms und aktualisiert die UI.
 * Wird von main.js nach dem ersten Render aufgerufen.
 */
async function loadLiveProgress() {
  const results = await Promise.allSettled(
    REFORMS.map(async r => {
      const { progress, docCount } = await fetchReformProgress(r.id);
      return { id: r.id, progress, docCount };
    })
  );

  let anyUpdated = false;

  results.forEach((result, i) => {
    if (result.status === "fulfilled" && result.value.progress !== null) {
      const { id, progress, docCount } = result.value;
      const reform = REFORMS.find(r => r.id === id);
      if (reform) {
        reform._liveProgress = progress;
        reform._docCount     = docCount;
        anyUpdated = true;
      }
    }
  });

  if (anyUpdated) {
    updateProgressBars();
    renderStats();
    showProgressSource("live");
  }
}

/**
 * Aktualisiert die Breite der Progress-Balken im Hero (ohne kompletten Re-Render).
 */
function updateProgressBars() {
  const items = document.querySelectorAll("#progress-list .progress-item");
  items.forEach(item => {
    const id     = item.dataset.reformId;
    const reform = REFORMS.find(r => r.id === id);
    if (!reform || reform._liveProgress == null) return;

    const pct   = reform._liveProgress;
    const bar   = item.querySelector(".progress-bar");
    const label = item.querySelector(".progress-pct");

    if (bar) {
      bar.style.transition = "width 0.9s cubic-bezier(0.4,0,0.2,1)";
      bar.style.width = pct + "%";
    }
    // Zahl gleichzeitig mit Balken aktualisieren
    if (label) label.textContent = pct + "\u202f%";
  });

  // Cards ebenfalls neu rendern
  renderCards();
}

/**
 * Zeigt einen kleinen Hinweis woher die Daten kommen.
 */
function showProgressSource(source) {
  const el = document.getElementById("progress-source");
  if (!el) return;
  if (source === "live") {
    el.innerHTML = `<span class="material-icons" style="font-size:0.75rem;vertical-align:middle">sync</span>
      Fortschritt live aus GitHub-Repo berechnet`;
    el.style.color = "#1a4fd6";
  } else if (source === "error") {
    el.innerHTML = `<span class="material-icons" style="font-size:0.75rem;vertical-align:middle">cloud_off</span>
      Fortschritt konnte nicht geladen werden – bitte Seite neu laden.`;
    el.style.color = "#c0392b";
  }
}
