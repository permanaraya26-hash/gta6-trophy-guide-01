// app.js — the Leonida Trophy Guide app.
// Fetches the trophy list, renders the checklist, the platinum roadmap and
// the filters, and wires up the tracker, the spoiler setting and the
// export/import buttons. Everything runs offline from files under app/.

import {
  loadEarned,
  saveEarned,
  setEarned,
  progressSummary,
  buildExport,
  readExport,
  downloadExport,
} from './tracker.js';
import { KIND_LABELS, KIND_FILTERS, applyFilters, kindCounts } from './filters.js';

// The six roadmap stages, in the order a player should work through them.
const ROADMAP_STAGES = [
  { stage: 1, title: 'Stage 1 · Story first', note: 'Chapters 1–4, the named missions and the finale — plus the one missable trophy, Positive Mental Attitude, while you travel.' },
  { stage: 2, title: 'Stage 2 · Strangers & side missions', note: 'The stranger strands: Andy, Kenton, Billy, Randy, Tyrone, and three more to reach eight.' },
  { stage: 3, title: 'Stage 3 · Activities sampler', note: 'Try every activity once, then master the shooting range, drone races and the rest.' },
  { stage: 4, title: 'Stage 4 · Collectibles & exploration', note: 'Card sets, WAiNK spots, challenges, vehicles and the whole map of Leonida.' },
  { stage: 5, title: 'Stage 5 · Partner heists & money', note: 'Heists and robberies with your partner, laundering, spending and properties.' },
  { stage: 6, title: 'Stage 6 · Platinum cleanup', note: '100% completion, the odd one-offs and the platinum itself.' },
];

const SPOILER_KEY = 'leonida-trophy-guide-spoilers-v1';

const state = {
  trophies: [],
  earned: loadEarned(),
  kind: 'all',
  query: '',
  spoilersHidden: window.localStorage.getItem(SPOILER_KEY) === '1',
};

const $ = (selector) => document.querySelector(selector);

// A story trophy's name and description are hidden while the spoiler
// setting is on and the trophy is not earned yet.
function spoilerHidden(trophy) {
  return state.spoilersHidden && trophy.kind === 'story' && !state.earned.has(trophy.id);
}

function gradeBadge(grade) {
  return `<span class="grade grade-${grade}">${grade}</span>`;
}

function trophyCard(trophy) {
  const earned = state.earned.has(trophy.id);
  const hidden = spoilerHidden(trophy);
  const name = hidden ? 'Hidden trophy — earn it to reveal' : trophy.name;
  const description = hidden ? 'Its name and description stay hidden until earned.' : trophy.description;
  const missable = trophy.missable ? '<span class="flag flag-missable">MISSABLE</span>' : '';
  const hiddenFlag = trophy.hidden ? '<span class="flag">Hidden on PSN</span>' : '';
  const sources = trophy.sources
    .map((source) => `<a href="${source.url}" target="_blank" rel="noopener">${source.name}</a>`)
    .join(' · ');
  return `<article class="trophy${earned ? ' earned' : ''}" data-id="${trophy.id}">
    <label class="trophy-check">
      <input type="checkbox" data-trophy="${trophy.id}"${earned ? ' checked' : ''}>
      <span class="trophy-main">
        <span class="trophy-head">${gradeBadge(trophy.grade)} <strong>${name}</strong> ${missable}${hiddenFlag}</span>
        <span class="trophy-desc">${description}</span>
        <span class="trophy-guide">${trophy.guide}</span>
        <span class="trophy-sources">Sources: ${sources}</span>
        <span class="trophy-meta">${KIND_LABELS[trophy.kind] ?? trophy.kind} · Stage ${trophy.roadmap_stage}</span>
      </span>
    </label>
  </article>`;
}

function renderProgress() {
  const summary = progressSummary(state.trophies, state.earned);
  $('#progress').textContent = `${summary.earned} / ${summary.total} earned`;
  const bar = $('#progress-bar');
  if (bar) bar.style.width = `${Math.round((summary.earned / summary.total) * 100)}%`;
  return summary;
}

function renderRoadmap(summary) {
  const wrap = $('#roadmap');
  wrap.innerHTML = ROADMAP_STAGES.map(({ stage, title, note }) => {
    const count = summary.byStage[stage] ?? { earned: 0, total: 0 };
    const names = state.trophies
      .filter((trophy) => trophy.roadmap_stage === stage)
      .map((trophy) => trophy.name)
      .join(', ');
    return `<section class="stage">
      <h3><span class="stage-count">${count.earned}/${count.total} earned</span> ${title}</h3>
      <p>${note}</p>
      <p class="stage-trophies">${names}</p>
    </section>`;
  }).join('');
}

function renderFilters() {
  const counts = kindCounts(state.trophies);
  const wrap = $('#filters');
  wrap.innerHTML = KIND_FILTERS.map((kind) => {
    const active = kind === state.kind ? ' aria-pressed="true"' : '';
    return `<button type="button" data-kind="${kind}"${active}>${KIND_LABELS[kind]} (${counts[kind]})</button>`;
  }).join('');
  wrap.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      state.kind = button.dataset.kind;
      renderFilters();
      renderList();
    });
  });
}

function renderList() {
  const list = applyFilters(state.trophies, state.kind, state.query);
  const wrap = $('#trophy-list');
  if (list.length === 0) {
    wrap.innerHTML = '<p class="empty">No trophies match this filter yet. GTA VI lists no online trophies, so the Online filter is empty by design — try All, Story or Activities.</p>';
    return;
  }
  wrap.innerHTML = list.map(trophyCard).join('');
  wrap.querySelectorAll('input[type="checkbox"]').forEach((box) => {
    box.addEventListener('change', () => {
      setEarned(state.earned, Number(box.dataset.trophy), box.checked);
      const summary = renderProgress();
      renderRoadmap(summary);
      renderList();
    });
  });
}

function showMessage(text) {
  const el = $('#message');
  el.textContent = text;
  el.hidden = false;
}

function wireControls() {
  const search = $('#search');
  search.addEventListener('input', () => {
    state.query = search.value;
    renderList();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement !== search) {
      event.preventDefault();
      search.focus();
    }
  });
  const spoiler = $('#spoiler');
  spoiler.checked = state.spoilersHidden;
  spoiler.addEventListener('change', () => {
    state.spoilersHidden = spoiler.checked;
    window.localStorage.setItem(SPOILER_KEY, spoiler.checked ? '1' : '0');
    renderList();
  });
  $('#export').addEventListener('click', () => {
    const data = buildExport(state.earned);
    downloadExport(data, 'leonida-trophy-guide-progress.json');
    showMessage(`Exported ${data.earned.length} earned trophies (${data.exported}).`);
  });
  $('#import-file').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const { earned, exported } = readExport(await file.text());
      state.earned = earned;
      saveEarned(state.earned);
      const summary = renderProgress();
      renderRoadmap(summary);
      renderList();
      showMessage(exported ? `Imported ${earned.size} earned trophies from the export of ${exported}.` : `Imported ${earned.size} earned trophies.`);
    } catch (error) {
      showMessage(`Could not import that file: ${error.message}`);
    }
    event.target.value = '';
  });
}

async function main() {
  const response = await fetch('./data/trophies.json');
  const data = await response.json();
  state.trophies = data.trophies;
  wireControls();
  renderFilters();
  const summary = renderProgress();
  renderRoadmap(summary);
  renderList();
}

main();
