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

- **Tracker** — tick trophies off; progress is saved in `localStorage` (key `gta6-trophy-guide-progress-v1`) and survives reloads. Export progress to `gta6-trophies-progress.json` and import it back; reset with confirmation.
- **Filters** — search by name, description or guide; filter by grade, kind (story / missable / collectibles / activities), and status (earned / remaining); sort by roadmap order, grade or name.
- **Spoiler setting** — on by default: un-earned story trophies show as "Hidden story trophy" until earned; turning it off reveals them all.
- **Platinum roadmap** — 6 stages in order (story → partners & strangers → activities → collectibles → money & crime → cleanup & 100%), each with its trophies as chips.
- **Missable flags** — 1 potentially missable trophy (Positive Mental Attitude: Lucia's Chapter 1 balcony meditation, which disappears after that chapter; there is no mission replay). Everything else is unmissable.
- **Cited guides** — every trophy has a guide in our own words plus named source links (PowerPyx, GTABase, Exophase, KeenGamer, OutputLag). Vague hidden trophies whose triggers are not yet confirmed say so honestly instead of inventing steps.

## Trophy counts

| Grade | Count |
|---|---|
| Platinum | 1 — Vice Got a Price! |
| Gold | 2 — A Long Road, You Gotta Know When to Get Off |
| Silver | 6 |
| Bronze | 46 |
| **Total** | **55** |

About 200 hours to platinum, difficulty about 4/10, 0 online trophies.

## Sources

Trophy names, descriptions and grades as published by PlayStation, cross-checked against PowerPyx, GTABase, Exophase, KeenGamer and TrueTrophies. Guides are written in our own words for this entry; sources are cited beside each trophy.

## License

MIT — see `LICENSE`. Unofficial fan guide, not affiliated with Rockstar Games.
