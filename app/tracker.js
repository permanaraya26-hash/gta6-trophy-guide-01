// tracker.js — earned-trophy progress for the Leonida Trophy Guide.
// Keeps the checklist in the browser's localStorage, exports it to a file
// and reads an export back. Nothing here talks to the network.

export const STORAGE_KEY = 'leonida-trophy-guide-earned-v1';
export const EXPORT_VERSION = 1;

// Read the earned set from localStorage. A missing or broken value means
// nothing is earned yet, so the guide still opens cleanly.
export function loadEarned() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id) => Number.isInteger(id)));
  } catch {
    return new Set();
  }
}

// Save the earned set back to localStorage.
export function saveEarned(earned) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

// Mark one trophy earned (true) or not earned (false) and persist it.
export function setEarned(earned, id, value) {
  if (value) earned.add(id);
  else earned.delete(id);
  saveEarned(earned);
  return earned;
}

// Count earned trophies overall and per roadmap stage, for the tracker
// header and the roadmap headings. Returns { earned, total, byStage }.
export function progressSummary(trophies, earned) {
  const byStage = {};
  for (const trophy of trophies) {
    const stage = trophy.roadmap_stage;
    if (!byStage[stage]) byStage[stage] = { earned: 0, total: 0 };
    byStage[stage].total += 1;
    if (earned.has(trophy.id)) byStage[stage].earned += 1;
  }
  return { earned: earned.size, total: trophies.length, byStage };
}

// Build the export object: versioned, timestamped, and listing the earned
// trophy ids. The file the reader downloads is this object as JSON.
export function buildExport(earned) {
  return {
    version: EXPORT_VERSION,
    exported: new Date().toISOString(),
    earned: [...earned].sort((a, b) => a - b),
  };
}

// Read an export back. Returns { earned, exported } where exported is the
// date the export file was made, or null when the file has no date.
// Throws when the file is not a recognisable export of this guide.
export function readExport(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') throw new Error('Not an export file.');
  if (!Array.isArray(parsed.earned)) throw new Error('Export has no earned list.');
  const earned = new Set(parsed.earned.filter((id) => Number.isInteger(id)));
  const exported = typeof parsed.exported === 'string' ? parsed.exported : null;
  return { earned, exported };
}

// Offer the export object as a file download in the browser.
export function downloadExport(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
