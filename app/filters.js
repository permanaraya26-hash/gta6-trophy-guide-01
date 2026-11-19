// Filters: search text, grade / kind / status filters, sort order, and the
// spoiler setting that hides un-earned story trophies.
export const GRADE_ORDER = { platinum: 0, gold: 1, silver: 2, bronze: 3 };

export function spoilerHides(trophy, earned, spoilerOn) {
  return spoilerOn && trophy.kind === 'story' && !earned.has(trophy.id);
}

export function applyFilters(trophies, state) {
  const q = state.search.trim().toLowerCase();
  let list = trophies.filter((t) => {
    if (state.grade !== 'all' && t.grade !== state.grade) return false;
    if (state.kind === 'missable') { if (!t.missable) return false; }
    else if (state.kind !== 'all' && t.kind !== state.kind) return false;
    if (state.status === 'earned' && !state.earned.has(t.id)) return false;
    if (state.status === 'remaining' && state.earned.has(t.id)) return false;
    if (q) {
      const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  if (state.sort === 'grade') {
    list = [...list].sort((a, b) => GRADE_ORDER[a.grade] - GRADE_ORDER[b.grade] || a.name.localeCompare(b.name));
  } else if (state.sort === 'name') {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  } else {
    list = [...list].sort((a, b) => a.roadmap_stage - b.roadmap_stage || a.id - b.id);
  }
  return list;
}
