# Leonida Trophy Guide — GTA VI (PS5)

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/permanaraya26-hash/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/permanaraya26-hash/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI, built for the [make.fun bounty "Build the best GTA 6 trophy guide"](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

A static, dependency-free web app that works with the network off. It lists every one of the 55 official PS5 trophies — 1 platinum, 2 gold, 6 silver, 46 bronze, 28 of them hidden on PlayStation until earned — with the exact official name, description and grade, a guide in our own words for each one with its sources cited, a 6-stage platinum roadmap, missable flags, and a tracker that saves your progress in the browser.

## How to open it

- Open `app/index.html` in a desktop browser, or
- run `node serve.ts` and open http://localhost:8080

No build step, no network requests at runtime — every file it loads lives under `app/`.

## Features

- **Tracker** — tick trophies off; progress is saved in `localStorage` (key `gta6-trophy-guide-progress-v1`) and survives reloads. Export progress to `gta6-trophies-progress.json` and import it back; reset with confirmation. Exports carry a version number and the export time, so importing one tells you when it was made.
- **Filters** — search by name, description, guide, grade or kind (press `/` anywhere to jump to the search box); filter by grade, kind (story / missable / collectibles / activities), and status (earned / remaining); sort by roadmap order, grade or name.
- **Spoiler setting** — on by default: un-earned story trophies show as "Hidden story trophy" until earned; turning it off reveals them all.
- **Platinum roadmap** — 6 stages in order (story → partners & strangers → activities → collectibles → money & crime → cleanup & 100%), each with its trophies as chips and a live count of how many of that stage you have earned.
- **Missable flags** — 1 potentially missable trophy (Positive Mental Attitude: Lucia's Chapter 1 balcony meditation, which disappears after that chapter; there is no mission replay). Everything else is unmissable.
- **Cited guides** — every trophy has a guide in our own words plus named source links (PowerPyx, GTABase, Exophase, KeenGamer, OutputLag). Vague hidden trophies whose triggers are not yet confirmed say so honestly instead of inventing steps.

## Platinum roadmap at a glance

| Stage | What it covers | Trophies |
|---|---|---|
| 1. Story first | Chapters 1–4, Gone Fishing through the final mission, plus Lucia's Chapter 1 meditation | 13 |
| 2. Partners & strangers | Final missions for Andy, Kenton, Billy, Randy and Tyrone; 8 stranger strands | 6 |
| 3. Activities & skills | Shooting Range golds, drone races, 20 races, fishing, arcade, bowling, hunting, Combat Focus | 10 |
| 4. Collectibles & counts | 250 stunts, 100 WAiNK spots, 3 card sets, 50 challenges, 100 vehicles, explore Leonida | 6 |
| 5. Money & crime | Shop and vault robberies, armored truck, gang operations, laundering, garages, Scooter Bros | 11 |
| 6. Cleanup & 100% | Remaining counts, A Long Road (100% Completion), then the platinum | 9 |
| **Total** | | **55** |

## Trophy counts

| Grade | Count |
|---|---|
| Platinum | 1 — Vice Got a Price! |
| Gold | 2 — A Long Road, You Gotta Know When to Get Off |
| Silver | 6 |
| Bronze | 46 |
| **Total** | **55** |

About 200 hours to platinum, difficulty about 4/10, 0 online trophies. 28 trophies are hidden on PlayStation until earned; 27 are visible from the start.

## How the tracker works

Progress lives in `localStorage` under the key `gta6-trophy-guide-progress-v1`, as a sorted JSON array of earned trophy ids (1–55). The export file `gta6-trophies-progress.json` adds a `version` field and an `exported` timestamp next to the same array; importing an older export (a bare array, or an object without a version) still works, and the import message shows the export date when one is present. Progress is per browser — export the file to move it to another machine.

## Sources

Trophy names, descriptions and grades as published by PlayStation, cross-checked against PowerPyx, GTABase, Exophase, KeenGamer and TrueTrophies. Guides are written in our own words for this entry; sources are cited beside each trophy.

## License

MIT — see `LICENSE`. Unofficial fan guide, not affiliated with Rockstar Games.
