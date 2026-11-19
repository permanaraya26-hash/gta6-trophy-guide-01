// filters.js — kind filters and search for the Leonida Trophy Guide.
// A filter is one of the kinds the guide tracks; the search matches a
// trophy's name, description, guide, grade and kind, so a reader can find
// a trophy by any word they remember about it.

export const KIND_LABELS = {
  all: 'All trophies',
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  online: 'Online',
};

// The kinds a reader can filter by, in the order the buttons show them.
export const KIND_FILTERS = ['all', 'story', 'missable', 'collectibles', 'activities', 'online'];

// Does this trophy belong under this filter? 'missable' is a flag, not a
// kind, and 'online' matches nothing in this game — GTA VI's list holds no
// online trophies, so that filter honestly shows an empty list.
export function matchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true;
  if (kind === 'online') return false;
  return trophy.kind === kind;
}

// Does this trophy match a search query? The query is matched, case
// folded, against the name, the official description, the guide text, the
// grade and the kind, so 'gold', 'story' or a mission name all find it.
// An empty query matches everything.
export function matchesSearch(trophy, query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    trophy.name,
    trophy.description,
    trophy.guide,
    trophy.grade,
    trophy.kind,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return needle.split(/\s+/).every((word) => haystack.includes(word));
}

// Apply both a kind filter and a search query to the trophy list.
export function applyFilters(trophies, kind, query) {
  return trophies.filter((trophy) => matchesKind(trophy, kind) && matchesSearch(trophy, query));
}

// Count how many trophies each kind filter would show, for the buttons.
export function kindCounts(trophies) {
  const counts = { all: trophies.length };
  for (const kind of KIND_FILTERS.slice(1)) {
    counts[kind] = trophies.filter((trophy) => matchesKind(trophy, kind)).length;
  }
  return counts;
}
