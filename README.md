# Linear Ranking Tournament Designer

A static web app for organizing **Bjerring Linear Ranking Tournaments** — a round-robin system that objectively ranks all players by competition results.

**[Live App](https://j-mathes.github.io/LRT-Designer/)** · CC BY-NC-SA 4.0 · © 2026 Jared Mathes

---

## Usage

Open `index.html` in any modern browser — no server or build step required. Can also be hosted on GitHub Pages.

---

## Features

- 5-step tournament wizard with quick-add numbered players or named roster
- 9 built-in schedules: 4–25 players, doubles (2v2) or triples (3v3), 1–5 courts
- Two methods: **Single Closed Cell** (one group) or **Sort & Sift** (multi-round, re-grouped by rank)
- Live score entry with automatic standings (sorted by W → points differential)
- Print-ready schedule sheets, scoresheets, and rule sheets
- Export: JSON, CSV, XLSX (standings); full app backup/restore
- Data stored in `localStorage` (IndexedDB fallback); no account needed

---

## Built-in Schedules

| Players | Type    | Courts | Games |
|---------|---------|--------|-------|
| 4       | Doubles | 1      | 3     |
| 5       | Doubles | 1      | 5     |
| 7       | Triples | 1      | 7     |
| 8       | Doubles | 2      | 7     |
| 9       | Triples | 1      | 12    |
| 12      | Doubles | 2      | 17    |
| 12      | Doubles | 3      | 11    |
| 16      | Doubles | 4      | 15    |
| 25      | Doubles | 5      | 30    |

Other player counts use Sort & Sift to split into groups.

---

## Files

```
index.html          — app shell
app.js              — all logic (vanilla ES6+, no frameworks)
styles.css          — all styles
roster-template.csv — sample CSV for roster import
```

---

## License

**CC BY-NC-SA 4.0** — free to share and adapt for non-commercial use with attribution.  
See [LICENSE](LICENSE) for full terms.


---

## Features

- **Tournament Wizard** — 5-step guided setup: name/date, athletes, format selection, scoring, review
- **9 Built-in Schedules** — covers 4–25 players across doubles and triples formats (1–5 courts)
- **Two Tournament Methods**
  - *Single Closed Cell* — one round, everyone plays everyone
  - *Sort & Sift* — multi-round, players re-grouped by ranking each round
- **Live Score Entry** — enter scores per game; standings update automatically
- **Standings & Rankings** — W/L/+− sorted tables with 🥇🥈🥉 indicators
- **Athlete Roster** — persistent player database; reuse across tournaments
- **Print Support** — schedule sheets, scoresheets, and rule sheets (print-friendly layouts)
- **Export / Import**
  - Tournament: JSON, CSV (standings), XLSX (via SheetJS)
  - Roster: CSV
  - Full app backup: JSON
- **Persistent Storage** — localStorage primary, IndexedDB fallback
- **Responsive** — works on desktop, iPad, and iPhone
- **No build step** — open `index.html` directly or host on GitHub Pages

---

## Getting Started

### Run Locally

1. Clone or download the repository.
2. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge).

> No server or build tools required. All files are static.

### GitHub Pages

1. Push the repo to GitHub.
2. Go to **Settings → Pages**, set source to the branch/root containing `index.html`.
3. Access the published URL.

---

## File Structure

```
index.html      — App shell (header, nav, viewRoot, modal, toasts, printRoot)
app.js          — All application logic (~2000 lines, vanilla ES6+)
styles.css      — All styling (CSS variables, responsive, print media queries)
reference/      — Reference materials (Bjerring LRT documentation)
```

---

## Tournament Formats

| ID      | Players | Type     | Courts | Games |
|---------|---------|----------|--------|-------|
| d4      | 4       | Doubles  | 1      | 3     |
| d5      | 5       | Doubles  | 1      | 5     |
| d8      | 8       | Doubles  | 2      | 7     |
| d12_2   | 12      | Doubles  | 2      | 17    |
| d12_3   | 12      | Doubles  | 3      | 11    |
| d16     | 16      | Doubles  | 4      | 15    |
| d25     | 25      | Doubles  | 5      | 30    |
| t7      | 7       | Triples  | 1      | 7     |
| t9      | 9       | Triples  | 1      | 12    |

For player counts not matching a single schedule, the **Sort & Sift** method splits players into groups using available schedule sizes.

---

## Scoring Formats

| Format      | Description                                          |
|-------------|------------------------------------------------------|
| Points      | First to N points (optional win-by-2)               |
| Timed       | Fixed time limit (e.g. 7 minutes); most points wins |

Standings are sorted by: **Wins (most first)** → **Points Differential** (tiebreaker).

---

## Keyboard / Workflow

- **Enter** in the player name field during wizard setup adds the player
- **Escape** closes any open modal
- Score input fields accept keyboard entry; tab between fields

---

## Data Management

All data is stored in the browser:
- **Primary:** `localStorage` (key: `lrt_v1`)
- **Fallback:** `IndexedDB` (store: `lrt`, key: `data`)

Use **Settings → Export Backup** to save a full JSON backup before clearing browser data.

---

## License

**CC BY-NC-SA 4.0** — Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International  
Copyright © 2026 Jared Mathes

You are free to share and adapt this work for **non-commercial** purposes with attribution. Derivative works must use the same license.

See [LICENSE](LICENSE) for full terms.
