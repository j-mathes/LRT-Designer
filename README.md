# Linear Ranking Tournament Designer

A static web app for organizing **Bjerring Linear Ranking Tournaments** — a round-robin system that objectively ranks all players by competition results.

**[Live App](https://j-mathes.github.io/LRT-Designer/)** · CC BY-NC-SA 4.0 · © 2026 Jared Mathes

---

## Usage

Open the [live app](https://j-mathes.github.io/LRT-Designer/) or open `index.html` locally in any modern browser — no server or build step required.

---

## Features

- **5-step tournament wizard** — name/date, athletes, format, scoring, review
- **9 built-in Bjerring schedules** — 4–25 players, doubles (2v2) or triples (3v3), 1–5 courts
- **Two tournament methods**
  - *Single Closed Cell* — one group, everyone plays everyone
  - *Sort & Sift* — multi-round, players re-grouped by ranking after each round
- **Schedule & Scores tabs** — row-per-round, column-per-court table layout; toggle player numbers on/off
- **Live score entry** — per-game inline inputs with score cap enforcement; standings update automatically
- **Standings** — W/L/+− sorted with rank badges; tiebreak by points differential
- **Athlete roster** — persistent player database reusable across tournaments
- **Print support** — schedule sheets, scoresheets (with schedule reference), and rule sheets
- **Export / Import** — per-tournament JSON/CSV/XLSX; full app backup/restore JSON; roster CSV
- **Persistent storage** — localStorage primary, IndexedDB fallback; no account needed
- **Multiple active tournaments** — run and switch between any number simultaneously
- **Responsive** — works on desktop, tablet, and mobile

---

## Built-in Schedules

| Players | Type    | Courts | Rounds |
|---------|---------|--------|--------|
| 4       | Doubles | 1      | 3      |
| 5       | Doubles | 1      | 5      |
| 7       | Triples | 1      | 7      |
| 8       | Doubles | 2      | 7      |
| 9       | Triples | 1      | 12     |
| 12      | Doubles | 2      | 17     |
| 12      | Doubles | 3      | 11     |
| 16      | Doubles | 4      | 15     |
| 25      | Doubles | 5      | 30     |

Other player counts use Sort & Sift to split into appropriately sized groups.

---

## Files

```
index.html          — app shell
app.js              — all logic (vanilla ES6+, no frameworks, ~2100 lines)
styles.css          — all styles
roster-template.csv — sample CSV for roster import
```

---

## License

**CC BY-NC-SA 4.0** — free to share and adapt for non-commercial use with attribution.  
See [LICENSE](LICENSE) for full terms.

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
