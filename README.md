# Leonida Trophy Guide — GTA VI (PS5)

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/permanaraya26-hash/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/permanaraya26-hash/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

Entry for the [make.fun](https://make.fun) bounty [Build the best GTA 6 trophy guide](https://make.fun/bounty/gta6-trophy-guide-01) — $250 USDC, top 50 paid.

An offline guide and tracker for all 55 Grand Theft Auto VI trophies on PlayStation 5: every official name, description and grade as PlayStation publishes them, a guide in our own words with its sources beside it, a six-stage road to the platinum, the game's one missable trophy flagged, and a checklist that saves your progress in the browser.

## Platinum roadmap at a glance

| Stage | What to do | Trophies |
| --- | --- | --- |
| 1 · Story first | Chapters 1–4, the named missions and the finale — and meditate at every spot while you travel | 13 |
| 2 · Strangers & side missions | Andy, Kenton, Billy, Randy, Tyrone, and three more stranger strands | 6 |
| 3 · Activities sampler | Try every activity once, then master the range, drone races and more | 10 |
| 4 · Collectibles & exploration | Card sets, WAiNK spots, challenges, vehicles and the whole map | 6 |
| 5 · Partner heists & money | Heists and robberies with your partner, laundering, spending, properties | 11 |
| 6 · Platinum cleanup | 100% completion, the odd one-offs, and the platinum itself | 9 |

The only missable trophy is **Positive Mental Attitude** (meditate at every spot across Leonida) — do it during stage 1, while you are still travelling between story missions.

## How the tracker works

- Tick a trophy when you earn it; progress is saved in `localStorage` in this browser and survives reloads.
- **Export progress** downloads a versioned JSON file with the export date; **Import progress** reads one back and tells you the date it was made.
- Filters: All, Story, Missable, Collectibles, Activities, Online (GTA VI lists no online trophies, so that filter is empty by design).
- Search matches a trophy's name, description, guide, grade and kind — press `/` to jump to the search box.
- The **spoiler setting** hides the names and descriptions of story trophies until you earn them.

## Run it

Serve `app/` with any static server and open `app/index.html` in desktop Chrome with the network off:

```sh
node serve.ts
# open http://localhost:8080
```

Build the entry (copies `app/` and `screenshots/` to the output directory and writes `dossier.json`):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Guides cite PowerPyx, GTABase, KeenGamer, Exophase, TrueTrophies and PSNProfiles beside each trophy. This guide is fan-made and not affiliated with Rockstar Games; it uses no Rockstar logo or official artwork.
