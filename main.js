/**
 * ReformGov – main.js
 * ====================
 * Rendert Hero-Progress-Liste und Reform-Cards dynamisch aus data.js
 */

document.addEventListener("DOMContentLoaded", () => {
  renderProgressList();
  renderCards();
  renderStats();

  // Nach initialem Render: Live-Fortschritt aus GitHub-Repo nachladen
  loadLiveProgress().catch(() => {
    showProgressSource("error");
  });
});

/* ── Hilfsfunktionen ── */

function statusLabel(status) {
  return status === "active" ? "In Bearbeitung" : "Beiträge gesucht";
}

function statusBadgeClass(status) {
  return status === "active" ? "badge-active" : "badge-open";
}

function statusIcon(status) {
  return status === "active" ? "edit" : "add_circle_outline";
}

function cardCta(status) {
  return status === "active" ? "Vorschlag lesen" : "Beitragen";
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit", month: "long", year: "numeric"
  });
}

/* ── Hero Progress-Liste ── */

function renderProgressList() {
  const container = document.getElementById("progress-list");
  if (!container) return;

  // Nur die ersten 5 im Hero anzeigen
  const visible = REFORMS.slice(0, 5);

  container.innerHTML = visible.map(r => `
    <li class="progress-item" data-reform-id="${r.id}">
      <div class="progress-icon ${r.status === "active" ? "pi-active" : "pi-open"}">
        <span class="material-icons" style="font-size:0.9rem">${r.icon}</span>
      </div>
      <span class="progress-label">${r.label}</span>
      <div class="progress-bar-wrap">
        <div class="progress-bar"
             style="width:0%;transition:none;${r.status !== "active" ? "background:var(--bg-mid)" : ""}">
        </div>
      </div>
      <span class="progress-pct" style="opacity:0">0&thinsp;%</span>
    </li>
  `).join("");

  // Balken + Zahl gleichzeitig animieren – nur wenn Live-Daten vorhanden
  requestAnimationFrame(() => {
    setTimeout(() => {
      container.querySelectorAll(".progress-item").forEach(item => {
        const id    = item.dataset.reformId;
        const r     = REFORMS.find(x => x.id === id);
        if (!r) return;
        // Kein Fallback – Balken bleibt bei 0 bis Live-Daten kommen
        const pct   = r._liveProgress ?? null;
        if (pct === null) return;
        const bar   = item.querySelector(".progress-bar");
        const label = item.querySelector(".progress-pct");
        if (bar) {
          bar.style.transition = "width 0.9s cubic-bezier(0.4,0,0.2,1)";
          bar.style.width = pct + "%";
        }
        if (label) {
          label.style.transition = "opacity 0.3s";
          label.style.opacity = "1";
          label.textContent = pct + "\u202f%";
        }
      });
    }, 150);
  });
}

/* ── Reform-Cards ── */

function renderCards() {
  const grid = document.getElementById("cards-grid");
  if (!grid) return;

  const cards = REFORMS.map(r => `
    <a class="card" href="${REPO_BASE}/${r.id}" target="_blank" rel="noopener">
      <div class="card-header">
        <div class="card-icon"><span class="material-icons">${r.icon}</span></div>
        <span class="badge ${statusBadgeClass(r.status)}">
          <span class="material-icons">${statusIcon(r.status)}</span>${statusLabel(r.status)}
        </span>
      </div>
      <h4>${r.label}</h4>
      <p>${REFORM_DESCRIPTIONS[r.id] ?? ""}</p>
      <div class="card-footer-meta">
        <span class="card-cta">
          ${cardCta(r.status)} <span class="material-icons" style="font-size:0.9rem">arrow_forward</span>
        </span>
        <span class="card-updated">Aktualisiert: ${formatDate(r.updated)}</span>
      </div>
    </a>
  `).join("");

  // Karte "Neues Thema" am Ende
  const addCard = `
    <a class="card card-new" href="https://github.com/reformgov/reformen/issues/new" target="_blank" rel="noopener">
      <div class="card-icon"><span class="material-icons">add</span></div>
      <h4>Neues Thema vorschlagen</h4>
      <p>Fehlt ein wichtiger Reformbereich? Schlage ihn als Issue auf GitHub vor.</p>
    </a>
  `;

  grid.innerHTML = cards + addCard;
}

/* ── Stats dynamisch ── */

function renderStats() {
  const totalEl    = document.getElementById("stat-total");
  const activeEl   = document.getElementById("stat-active");
  const avgEl      = document.getElementById("stat-avg");

  if (totalEl) totalEl.textContent = REFORMS.length;

  const active = REFORMS.filter(r => r.status === "active").length;
  if (activeEl) activeEl.textContent = active;

  const avg = Math.round(
    REFORMS.reduce((sum, r) => sum + r.progress, 0) / REFORMS.length
  );
  if (avgEl) avgEl.textContent = avg + "\u202f%";
}
