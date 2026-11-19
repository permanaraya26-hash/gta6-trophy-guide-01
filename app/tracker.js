// Tracker: earned progress saved in localStorage, with export / import / reset.
// Storage key is fixed by the guide spec so exports stay compatible.
export const STORAGE_KEY = 'gta6-trophy-guide-progress-v1';
export const EXPORT_FILENAME = 'gta6-trophies-progress.json';

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id) => Number.isInteger(id) && id >= 1 && id <= 55));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

export function downloadExport(earned) {
  const blob = new Blob([JSON.stringify({ exported: new Date().toISOString(), earned: [...earned].sort((a, b) => a - b) }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = EXPORT_FILENAME;
  a.click();
  URL.revokeObjectURL(url);
}

// Reads a user-chosen JSON file and returns {count, total} of valid ids restored,
// or {error} when the file cannot be parsed. Bad entries are ignored, never fatal.
export async function importProgressFile(file) {
  let parsed;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    return { error: 'That file is not valid JSON.' };
  }
  const list = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(list)) return { error: 'No trophy list found in that file.' };
  const valid = list.filter((id) => Number.isInteger(id) && id >= 1 && id <= 55);
  return { earned: new Set(valid), count: valid.length, total: list.length };
}
