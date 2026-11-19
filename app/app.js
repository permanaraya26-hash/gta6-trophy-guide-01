// Boot + render for the Leonida Trophy Guide: loads trophies.json, renders the
// roadmap, the missable section and the filterable trophy tracker.
import { STORAGE_KEY, loadEarned, saveEarned, downloadExport, importProgressFile } from './tracker.js';
import { applyFilters, spoilerHides } from './filters.js';

const STAGES = [
  { n: 1, title: 'Story first', text: 'Play Chapters 1–4 in order, Gone Fishing through the final mission. Make a manual save at the start of every chapter and one before the final mission — there is no mission replay. Do Lucia\u2019s balcony meditation in Chapter 1 (see the missable warning below).' },
  { n: 2, title: 'Partners & strangers', text: 'Finish the final missions for Andy, Kenton, Billy, Randy and Tyrone, and complete 8 stranger mission strands. These stay open after the story, so finish them in free roam if needed.' },
  { n: 3, title: 'Activities & skills', text: 'Gold medals in all Shooting Range challenges, Top Fun drone races at every location, 20 different races, beat Cal at fishing, finish an arcade game and a bowling game, meditate at every spot, and hunt a unique animal for Bret.' },
  { n: 4, title: 'Collectibles & counts', text: '250 stunts, WAiNK at 100 locations, 3 collectible card sets, 50 challenges, 100 vehicles discovered, and explore all of Leonida.' },
  { n: 5, title: 'Money & crime', text: 'Rob 3 shops back-to-back with your partner, rob a jewelry store undetected, 5 bank vaults, an armored truck, an illegal operation per gang, launder $250,000 in Marked Bills, spend $100,000, buy all garages, and register 10 vehicles to Scooter Bros.' },
  { n: 6, title: 'Cleanup & 100%', text: 'Finish the remaining counts, attain 100% Completion (A Long Road, gold), and the platinum — Vice Got a Price! — pops with the last trophy.' },
];

const state = {
  search: '', grade: 'all', kind: 'all', status: 'all', sort: 'roadmap',
  spoilerOn: true, earned: loadEarned(),
};
let trophies = [];

const $ = (id) => document.getElementById(id);

function gradeDot(grade) {
  return { platinum: '#bfeef5', gold: '#f5b301', silver: '#c7ccd4', bronze: '#b0703a' }[grade];
}

function renderProgress() {
  const total = trophies.length || 55;
  const n = state.earned.size;
  const pct = Math.round((n / total) * 100);
  $('progressText').textContent = `${n} of ${total} earned · ${pct}%`;
  $('progressBar').style.width = `${pct}%`;
  const counts = {};
  for (const t of trophies) if (state.earned.has(t.id)) counts[t.grade] = (counts[t.grade] || 0) + 1;
  $('gradeCounts').textContent = `Platinum ${counts.platinum || 0}/1 · Gold ${counts.gold || 0}/2 · Silver ${counts.silver || 0}/6 · Bronze ${counts.bronze || 0}/46`;
  $('platinumLine').textContent = state.earned.has(1)
    ? 'Platinum earned — Vice Got a Price! You are a Leonida Legend.'
    : `Platinum “Vice Got a Price!” — ${54 - [...state.earned].filter((id) => id !== 1).length} more trophies to go.`;
}

function renderRoadmap() {
  const wrap = $('roadmapStages');
  wrap.replaceChildren();
  for (const stage of STAGES) {
    const div = document.createElement('div');
    div.className = 'stage';
    const h = document.createElement('h3');
    h.innerHTML = `<span class="stage-num">Stage ${stage.n}.</span> `;
    h.append(document.createTextNode(stage.title));
    div.append(h);
    const p = document.createElement('p');
    p.textContent = stage.text;
    div.append(p);
    const chips = document.createElement('div');
    chips.className = 'chips';
    for (const t of trophies.filter((x) => x.roadmap_stage === stage.n)) {
      const chip = document.createElement('span');
      chip.className = 'chip' + (state.earned.has(t.id) ? ' earned' : '');
      const dot = document.createElement('span');
      dot.className = 'dot';
      dot.style.background = gradeDot(t.grade);
      chip.append(dot, document.createTextNode(t.name));
      chips.append(chip);
    }
    div.append(chips);
    if (stage.n === 1) {
      const call = document.createElement('div');
      call.className = 'callout';
      call.textContent = '⚠ Missable here: Lucia\u2019s balcony meditation in Chapter 1 (Positive Mental Attitude). Do it before Chapter 1 ends — there is no mission replay.';
      div.append(call);
    }
    wrap.append(div);
  }
}

function renderMissable() {
  const list = trophies.filter((t) => t.missable);
  $('missableText').textContent = `${list.length} trophy is potentially missable. GTA VI has no mission replay and no New Game Plus, so keep a manual save at the start of every chapter and one before the final mission. Every other trophy can be earned in free roam after the credits.`;
  const wrap = $('missableList');
  wrap.replaceChildren();
  for (const t of list) {
    const div = document.createElement('div');
    div.className = 'card';
    const h = document.createElement('h3');
    h.textContent = `${t.name} — ${t.description}`;
    div.append(h);
    const p = document.createElement('p');
    p.textContent = t.guide;
    div.append(p);
    wrap.append(div);
  }
}

function trophyCard(t) {
  const hidden = spoilerHides(t, state.earned, state.spoilerOn);
  const card = document.createElement('article');
  card.className = 'card' + (state.earned.has(t.id) ? ' earned-card' : '');
  const head = document.createElement('div');
  head.className = 'card-head';
  const h = document.createElement('h3');
  h.textContent = hidden ? 'Hidden story trophy' : t.name;
  const badge = document.createElement('span');
  badge.className = `badge ${t.grade}`;
  badge.textContent = t.grade;
  head.append(h, badge);
  if (t.hidden) { const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = 'Hidden on PSN'; head.append(tag); }
  if (t.missable) { const tag = document.createElement('span'); tag.className = 'tag missable-tag'; tag.textContent = '⚠ Missable'; head.append(tag); }
  const kind = document.createElement('span');
  kind.className = 'tag';
  kind.textContent = t.kind;
  head.append(kind);
  card.append(head);

  const desc = document.createElement('p');
  desc.className = 'desc';
  if (hidden) {
    desc.innerHTML = '<span class="spoiler-note">Hidden story trophy — earn it to reveal its name and description.</span>';
  } else {
    desc.textContent = t.description;
  }
  card.append(desc);

  const label = document.createElement('label');
  label.className = 'earn';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = state.earned.has(t.id);
  box.setAttribute('aria-label', `Mark ${hidden ? 'this story trophy' : t.name} as earned`);
  box.addEventListener('change', () => {
    if (box.checked) state.earned.add(t.id); else state.earned.delete(t.id);
    saveEarned(state.earned);
    renderAll();
  });
  label.append(box, document.createTextNode(box.checked ? 'Earned ✓' : 'Mark as earned'));
  card.append(label);

  if (!hidden) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'guide-toggle';
    btn.textContent = 'Show guide';
    btn.setAttribute('aria-expanded', 'false');
    const body = document.createElement('div');
    body.className = 'guide-body';
    body.hidden = true;
    const gp = document.createElement('p');
    gp.textContent = t.guide;
    body.append(gp);
    const src = document.createElement('p');
    src.className = 'sources';
    src.append(document.createTextNode('Sources: '));
    t.sources.forEach((s, i) => {
      if (i) src.append(document.createTextNode(' · '));
      const a = document.createElement('a');
      a.href = s.url; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = s.name;
      src.append(a);
    });
    body.append(src);
    btn.addEventListener('click', () => {
      body.hidden = !body.hidden;
      btn.textContent = body.hidden ? 'Show guide' : 'Hide guide';
      btn.setAttribute('aria-expanded', String(!body.hidden));
    });
    card.append(btn, body);
  }
  return card;
}

function renderList() {
  const list = applyFilters(trophies, state);
  const wrap = $('trophyList');
  wrap.replaceChildren();
  for (const t of list) wrap.append(trophyCard(t));
  $('resultCount').textContent = `Showing ${list.length} of ${trophies.length} trophies`;
  $('emptyMsg').hidden = list.length > 0;
}

function renderAll() {
  renderProgress();
  renderRoadmap();
  renderMissable();
  renderList();
}

async function boot() {
  const res = await fetch('data/trophies.json');
  const doc = await res.json();
  trophies = doc.trophies;
  $('searchBox').addEventListener('input', (e) => { state.search = e.target.value; renderList(); });
  $('gradeFilter').addEventListener('change', (e) => { state.grade = e.target.value; renderList(); });
  $('kindFilter').addEventListener('change', (e) => { state.kind = e.target.value; renderList(); });
  $('statusFilter').addEventListener('change', (e) => { state.status = e.target.value; renderList(); });
  $('sortSelect').addEventListener('change', (e) => { state.sort = e.target.value; renderList(); });
  $('spoilerToggle').addEventListener('change', (e) => { state.spoilerOn = e.target.checked; renderList(); });
  $('exportBtn').addEventListener('click', () => {
    downloadExport(state.earned);
    $('importMsg').textContent = `Exported ${state.earned.size} earned trophies to ${'gta6-trophies-progress.json'}.`;
  });
  $('importFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const result = await importProgressFile(file);
    if (result.error) { $('importMsg').textContent = result.error; }
    else {
      state.earned = result.earned;
      saveEarned(state.earned);
      $('importMsg').textContent = `Imported ${result.count} earned trophies (${result.total} entries in file).`;
      renderAll();
    }
    e.target.value = '';
  });
  $('resetBtn').addEventListener('click', () => {
    if (window.confirm('Reset all earned trophies? This clears your saved progress.')) {
      state.earned = new Set();
      saveEarned(state.earned);
      $('importMsg').textContent = 'Progress reset.';
      renderAll();
    }
  });
  renderAll();
}

boot();
