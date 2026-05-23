/*
 * Linear Ranking Tournament Designer  app.js
 *
 * Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
 * Copyright (c) 2026 Jared Mathes
 *
 * Based on the Bjerring Linear Ranking Tournament system described in
 * "Linear Ranking Tournaments" by Michael P. Fleming.
 */
'use strict';

// 
// SCHEDULE DATA
// R(label, ...slots)  S(court, t1_positions, t2_positions, out?)
// 
const R = (l, ...s) => ({ label: l, slots: s });
const S = (c, t1, t2, out = []) => ({ court: c, t1, t2, out });

const SCHEDULES = {
  d4: {
    id: 'd4', name: 'Doubles -- 4 Players', type: 'doubles', size: 4, courts: 1, gameCount: 3,
    rounds: [
      R('A', S(1,[1,2],[3,4])), R('B', S(1,[1,3],[2,4])), R('C', S(1,[1,4],[2,3]))
    ]
  },
  d5: {
    id: 'd5', name: 'Doubles -- 5 Players', type: 'doubles', size: 5, courts: 1, gameCount: 5,
    rounds: [
      R('A', S(1,[1,2],[3,4],[5])), R('B', S(1,[1,3],[2,5],[4])),
      R('C', S(1,[1,5],[2,4],[3])), R('D', S(1,[1,4],[3,5],[2])),
      R('E', S(1,[2,3],[4,5],[1]))
    ]
  },
  d8: {
    id: 'd8', name: 'Doubles -- 8 Players', type: 'doubles', size: 8, courts: 2, gameCount: 7,
    rounds: [
      R('A', S(1,[1,2],[3,4]),   S(2,[5,6],[7,8])),
      R('B', S(1,[1,5],[2,6]),   S(2,[3,7],[4,8])),
      R('C', S(1,[1,7],[2,8]),   S(2,[3,5],[4,6])),
      R('D', S(1,[1,3],[5,7]),   S(2,[2,4],[6,8])),
      R('E', S(1,[1,8],[3,6]),   S(2,[2,7],[4,5])),
      R('F', S(1,[1,4],[5,8]),   S(2,[2,3],[6,7])),
      R('G', S(1,[1,6],[4,7]),   S(2,[2,5],[3,8]))
    ]
  },
  d12_2: {
    id: 'd12_2', name: 'Doubles -- 12 Players (2 Courts)', type: 'doubles', size: 12, courts: 2, gameCount: 17,
    rounds: [
      R('A',  S(1,[1,2],[6,7]),    S(2,[3,12],[4,10])),
      R('B',  S(1,[5,9],[8,11]),   S(2,[4,6],[2,7])),
      R('C',  S(1,[1,3],[7,8]),    S(2,[2,4],[5,11])),
      R('D',  S(1,[6,10],[9,12]),  S(2,[5,7],[3,8])),
      R('E',  S(1,[1,4],[8,9]),    S(2,[3,5],[6,12])),
      R('F',  S(1,[7,11],[2,10]),  S(2,[6,8],[4,9])),
      R('G',  S(1,[1,5],[9,10]),   S(2,[8,12],[3,11])),
      R('H',  S(1,[1,6],[10,11]),  S(2,[2,9],[4,12])),
      R('I',  S(1,[1,7],[11,12]),  S(2,[3,10],[2,5])),
      R('J',  S(1,[1,8],[2,12]),   S(2,[7,9],[5,10])),
      R('K',  S(1,[4,11],[3,6]),   S(2,[10,12],[2,8])),
      R('L',  S(1,[1,9],[2,3]),    S(2,[8,10],[6,11])),
      R('M',  S(1,[5,12],[4,7]),   S(2,[2,11],[3,9])),
      R('N',  S(1,[1,10],[3,4]),   S(2,[9,11],[7,12])),
      R('O',  S(1,[1,11],[4,5]),   S(2,[3,7],[6,9])),
      R('P',  S(1,[1,12],[5,6]),   S(2,[4,8],[7,10])),
      R('Q',  S(1,[2,6],[5,8]))
    ]
  },
  d12_3: {
    id: 'd12_3', name: 'Doubles -- 12 Players (3 Courts)', type: 'doubles', size: 12, courts: 3, gameCount: 11,
    rounds: [
      R('A', S(1,[1,2],[6,7]),    S(2,[3,12],[4,10]),  S(3,[5,9],[8,11])),
      R('B', S(1,[1,3],[7,8]),    S(2,[2,4],[5,11]),   S(3,[6,10],[9,12])),
      R('C', S(1,[1,4],[8,9]),    S(2,[3,5],[6,12]),   S(3,[7,11],[2,10])),
      R('D', S(1,[1,5],[9,10]),   S(2,[4,6],[2,7]),    S(3,[8,12],[3,11])),
      R('E', S(1,[1,6],[10,11]),  S(2,[5,7],[3,8]),    S(3,[2,9],[4,12])),
      R('F', S(1,[1,7],[11,12]),  S(2,[6,8],[4,9]),    S(3,[3,10],[2,5])),
      R('G', S(1,[1,8],[2,12]),   S(2,[7,9],[5,10]),   S(3,[4,11],[3,6])),
      R('H', S(1,[1,9],[2,3]),    S(2,[8,10],[6,11]),  S(3,[5,12],[4,7])),
      R('I', S(1,[1,10],[3,4]),   S(2,[9,11],[7,12]),  S(3,[2,6],[5,8])),
      R('J', S(1,[1,11],[4,5]),   S(2,[10,12],[2,8]),  S(3,[3,7],[6,9])),
      R('K', S(1,[1,12],[5,6]),   S(2,[2,11],[3,9]),   S(3,[4,8],[7,10]))
    ]
  },
  d16: {
    id: 'd16', name: 'Doubles -- 16 Players (4 Courts)', type: 'doubles', size: 16, courts: 4, gameCount: 15,
    rounds: [
      R('A', S(1,[1,2],[7,12]),  S(2,[3,4],[6,10]),   S(3,[5,13],[14,16]),  S(4,[8,9],[11,15])),
      R('B', S(1,[1,7],[2,12]),  S(2,[3,6],[4,10]),   S(3,[5,14],[13,16]),  S(4,[8,11],[9,15])),
      R('C', S(1,[1,12],[2,7]),  S(2,[3,10],[4,6]),   S(3,[5,16],[13,14]),  S(4,[8,15],[9,11])),
      R('D', S(1,[1,3],[8,13]),  S(2,[4,5],[7,11]),   S(3,[2,6],[14,15]),   S(4,[9,10],[12,16])),
      R('E', S(1,[1,8],[3,13]),  S(2,[4,7],[5,11]),   S(3,[2,14],[6,15]),   S(4,[9,12],[10,16])),
      R('F', S(1,[1,13],[3,8]),  S(2,[4,11],[5,7]),   S(3,[2,15],[6,14]),   S(4,[9,16],[10,12])),
      R('G', S(1,[1,4],[9,14]),  S(2,[5,6],[8,12]),   S(3,[3,7],[15,16]),   S(4,[2,10],[11,13])),
      R('H', S(1,[1,9],[4,14]),  S(2,[5,8],[6,12]),   S(3,[3,15],[7,16]),   S(4,[2,11],[10,13])),
      R('I', S(1,[1,14],[4,9]),  S(2,[5,12],[6,8]),   S(3,[3,16],[7,15]),   S(4,[2,13],[10,11])),
      R('J', S(1,[1,5],[10,15]), S(2,[6,7],[9,13]),   S(3,[2,4],[8,16]),    S(4,[3,11],[12,14])),
      R('K', S(1,[1,10],[5,15]), S(2,[6,9],[7,13]),   S(3,[2,8],[4,16]),    S(4,[3,12],[11,14])),
      R('L', S(1,[1,15],[5,10]), S(2,[6,13],[7,9]),   S(3,[2,16],[4,8]),    S(4,[3,14],[11,12])),
      R('M', S(1,[1,6],[11,16]), S(2,[7,8],[10,14]),  S(3,[2,3],[5,9]),     S(4,[4,12],[13,15])),
      R('N', S(1,[1,11],[6,16]), S(2,[7,10],[8,14]),  S(3,[2,5],[3,9]),     S(4,[4,13],[12,15])),
      R('O', S(1,[1,16],[6,11]), S(2,[7,14],[8,10]),  S(3,[2,9],[3,5]),     S(4,[4,15],[12,13]))
    ]
  },
  d25: {
    id: 'd25', name: 'Doubles -- 25 Players (5 Courts)', type: 'doubles', size: 25, courts: 5, gameCount: 30,
    rounds: [
      R('A',  S(1,[1,2],[3,4]),     S(2,[6,7],[8,9]),     S(3,[11,12],[13,14]), S(4,[16,17],[18,19]), S(5,[21,22],[23,24])),
      R('B',  S(1,[1,3],[2,5]),     S(2,[6,8],[7,10]),    S(3,[11,13],[12,15]), S(4,[16,18],[17,20]), S(5,[21,23],[22,25])),
      R('C',  S(1,[1,4],[3,5]),     S(2,[6,9],[8,10]),    S(3,[11,14],[13,15]), S(4,[16,19],[18,20]), S(5,[21,24],[23,25])),
      R('D',  S(1,[1,5],[2,4]),     S(2,[6,10],[7,9]),    S(3,[11,15],[12,14]), S(4,[16,20],[17,19]), S(5,[21,25],[22,24])),
      R('E',  S(1,[2,3],[4,5]),     S(2,[7,8],[9,10]),    S(3,[12,13],[14,15]), S(4,[17,18],[19,20]), S(5,[22,23],[24,25])),
      R('F',  S(1,[1,6],[11,16]),   S(2,[2,7],[13,19]),   S(3,[3,8],[15,17]),   S(4,[4,9],[12,20]),   S(5,[5,10],[14,18])),
      R('G',  S(1,[1,11],[6,21]),   S(2,[2,13],[7,25]),   S(3,[3,15],[8,24]),   S(4,[4,12],[9,23]),   S(5,[5,14],[10,22])),
      R('H',  S(1,[1,16],[11,21]),  S(2,[2,19],[13,25]),  S(3,[3,17],[15,24]),  S(4,[4,20],[12,23]),  S(5,[5,18],[14,22])),
      R('I',  S(1,[1,21],[6,16]),   S(2,[2,25],[7,19]),   S(3,[3,24],[8,17]),   S(4,[4,23],[9,20]),   S(5,[5,22],[10,18])),
      R('J',  S(1,[6,11],[16,21]),  S(2,[7,13],[19,25]),  S(3,[8,15],[17,24]),  S(4,[9,12],[20,23]),  S(5,[10,14],[18,22])),
      R('K',  S(1,[1,10],[15,19]),  S(2,[2,6],[12,17]),   S(3,[3,7],[14,20]),   S(4,[4,8],[11,18]),   S(5,[5,9],[13,16])),
      R('L',  S(1,[1,15],[10,23]),  S(2,[2,12],[6,22]),   S(3,[3,14],[7,21]),   S(4,[4,11],[8,25]),   S(5,[5,13],[9,24])),
      R('M',  S(1,[1,19],[15,23]),  S(2,[2,17],[12,22]),  S(3,[3,20],[14,21]),  S(4,[4,18],[11,25]),  S(5,[5,16],[13,24])),
      R('N',  S(1,[1,23],[10,19]),  S(2,[2,22],[6,17]),   S(3,[3,21],[7,20]),   S(4,[4,25],[8,18]),   S(5,[5,24],[9,16])),
      R('O',  S(1,[10,15],[19,23]), S(2,[6,12],[17,22]),  S(3,[7,14],[20,21]),  S(4,[8,11],[18,25]),  S(5,[9,13],[16,24])),
      R('P',  S(1,[1,9],[14,17]),   S(2,[2,10],[11,20]),  S(3,[3,6],[13,18]),   S(4,[4,7],[15,16]),   S(5,[5,8],[12,19])),
      R('Q',  S(1,[1,14],[9,25]),   S(2,[2,11],[10,24]),  S(3,[3,13],[6,23]),   S(4,[4,15],[7,22]),   S(5,[5,12],[8,21])),
      R('R',  S(1,[1,17],[14,25]),  S(2,[2,20],[11,24]),  S(3,[3,18],[13,23]),  S(4,[4,16],[15,22]),  S(5,[5,19],[12,21])),
      R('S',  S(1,[1,25],[9,17]),   S(2,[2,24],[10,20]),  S(3,[3,23],[6,18]),   S(4,[4,22],[7,16]),   S(5,[5,21],[8,19])),
      R('T',  S(1,[9,14],[17,25]),  S(2,[10,11],[20,24]), S(3,[6,13],[18,23]),  S(4,[7,15],[16,22]),  S(5,[8,12],[19,21])),
      R('U',  S(1,[1,8],[13,20]),   S(2,[2,9],[15,18]),   S(3,[3,10],[12,16]),  S(4,[4,6],[14,19]),   S(5,[5,7],[11,17])),
      R('V',  S(1,[1,13],[8,22]),   S(2,[2,15],[9,21]),   S(3,[3,12],[10,25]),  S(4,[4,14],[6,24]),   S(5,[5,11],[7,23])),
      R('W',  S(1,[1,20],[13,22]),  S(2,[2,18],[15,21]),  S(3,[3,16],[12,25]),  S(4,[4,19],[14,24]),  S(5,[5,17],[11,23])),
      R('X',  S(1,[1,22],[8,20]),   S(2,[2,21],[9,18]),   S(3,[3,25],[10,16]),  S(4,[4,24],[6,19]),   S(5,[5,23],[7,17])),
      R('Y',  S(1,[8,13],[20,22]),  S(2,[9,15],[18,21]),  S(3,[10,12],[16,25]), S(4,[6,14],[19,24]),  S(5,[7,11],[17,23])),
      R('Z',  S(1,[1,7],[12,18]),   S(2,[2,8],[14,16]),   S(3,[3,9],[11,19]),   S(4,[4,10],[13,17]),  S(5,[5,6],[15,20])),
      R('AA', S(1,[1,12],[7,24]),   S(2,[2,14],[8,23]),   S(3,[3,11],[9,22]),   S(4,[4,13],[10,21]),  S(5,[5,15],[6,25])),
      R('BB', S(1,[1,18],[12,24]),  S(2,[2,16],[14,23]),  S(3,[3,19],[11,22]),  S(4,[4,17],[13,21]),  S(5,[5,20],[15,25])),
      R('CC', S(1,[1,24],[7,18]),   S(2,[2,23],[8,16]),   S(3,[3,22],[9,19]),   S(4,[4,21],[10,17]),  S(5,[5,25],[6,20])),
      R('DD', S(1,[7,12],[18,24]),  S(2,[8,14],[16,23]),  S(3,[9,11],[19,22]),  S(4,[10,13],[17,21]), S(5,[6,15],[20,25]))
    ]
  },
  t7: {
    id: 't7', name: 'Triples -- 7 Players', type: 'triples', size: 7, courts: 1, gameCount: 7,
    rounds: [
      R('A', S(1,[1,2,3],[4,5,6],[7])), R('B', S(1,[1,4,7],[2,3,5],[6])),
      R('C', S(1,[2,6,7],[1,3,4],[5])), R('D', S(1,[2,4,5],[3,6,7],[1])),
      R('E', S(1,[1,5,7],[3,4,6],[2])), R('F', S(1,[1,2,6],[3,5,7],[4])),
      R('G', S(1,[1,5,6],[2,4,7],[3]))
    ]
  },
  t9: {
    id: 't9', name: 'Triples -- 9 Players', type: 'triples', size: 9, courts: 1, gameCount: 12,
    rounds: [
      R('A', S(1,[1,4,7],[2,5,9],[3,6,8])), R('B', S(1,[1,5,8],[2,6,7],[3,4,9])),
      R('C', S(1,[1,6,9],[2,4,8],[3,5,7])), R('D', S(1,[2,4,8],[3,5,7],[1,6,9])),
      R('E', S(1,[2,5,9],[3,6,8],[1,4,7])), R('F', S(1,[2,6,7],[3,4,9],[1,5,8])),
      R('G', S(1,[3,4,9],[1,5,8],[2,6,7])), R('H', S(1,[3,5,7],[1,6,9],[2,4,8])),
      R('I', S(1,[3,6,8],[1,4,7],[2,5,9])), R('J', S(1,[1,2,3],[4,5,6],[7,8,9])),
      R('K', S(1,[4,5,6],[7,8,9],[1,2,3])), R('L', S(1,[7,8,9],[1,2,3],[4,5,6]))
    ]
  }
};

// Ordered list of all schedule IDs for suggestion logic
const SCHEDULE_LIST = Object.values(SCHEDULES);

// 
// SUBSET FINDER  for sort-sift multi-group tournaments
// Returns arrays of group sizes (each group uses 1 court)
// Valid single-court sizes: 4 (d4), 5 (d5), 7 (t7), 9 (t9)
// 
function findSubsetOptions(n, courts, type) {
  const sizes = type === 'triples' ? [7, 9] : [4, 5];
  const results = [];
  const seen = new Set();
  function recurse(rem, groups) {
    if (groups.length === courts) {
      if (rem === 0) {
        const key = [...groups].sort((a,b) => a-b).join(',');
        if (!seen.has(key)) { seen.add(key); results.push([...groups]); }
      }
      return;
    }
    for (const sz of sizes) {
      if (sz <= rem) {
        groups.push(sz);
        recurse(rem - sz, groups);
        groups.pop();
      }
    }
  }
  recurse(n, []);
  return results.slice(0, 8); // cap at 8 options
}

// 
// STORAGE
// 
const LS_KEY = 'lrt_v1';

const IDB_CONFIG = { name: 'lrt_db', store: 'data', ver: 1 };
let _idb = null;
function openIDB() {
  if (_idb) return Promise.resolve(_idb);
  return new Promise((res, rej) => {
    const req = indexedDB.open(IDB_CONFIG.name, IDB_CONFIG.ver);
    req.onupgradeneeded = e => e.target.result.createObjectStore(IDB_CONFIG.store);
    req.onsuccess = e => { _idb = e.target.result; res(_idb); };
    req.onerror = () => rej(req.error);
  });
}
async function idbSet(val) {
  const db = await openIDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(IDB_CONFIG.store, 'readwrite');
    tx.objectStore(IDB_CONFIG.store).put(val, LS_KEY);
    tx.oncomplete = res; tx.onerror = () => rej(tx.error);
  });
}
async function idbGet() {
  const db = await openIDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(IDB_CONFIG.store, 'readonly');
    const req = tx.objectStore(IDB_CONFIG.store).get(LS_KEY);
    req.onsuccess = () => res(req.result); req.onerror = () => rej(req.error);
  });
}

function storeSave(data) {
  const json = JSON.stringify(data);
  try {
    localStorage.setItem(LS_KEY, json);
  } catch (e) {
    idbSet(json).catch(console.error);
  }
}
async function storeLoad() {
  let raw = localStorage.getItem(LS_KEY);
  if (!raw) { try { raw = await idbGet(); } catch (_) {} }
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (_) { return null; }
}

// 
// APP DATA (persisted) & APP STATE (runtime)
// 
const DEFAULT_SETTINGS = {
  defaultScoringType: 'points',
  defaultPointsTarget: 15,
  defaultTimeLimitMinutes: 7,
  defaultWinBy2: false,
  defaultSport: 'Volleyball'
};

let App = {
  data: {
    version: '1.0.0',
    settings: { ...DEFAULT_SETTINGS },
    athletes: [],
    tournaments: []
  },
  state: {
    view: 'dashboard',
    tid: null,          // active tournament id
    tab: 'schedule',    // active tab in tournament detail
    rid: 0,             // round index
    gid: 0,             // group index
    wStep: 1,           // wizard step
    wData: {},          // wizard working data
    search: ''
  },
  save() { storeSave(this.data); },
  async load() {
    const saved = await storeLoad();
    if (saved) {
      this.data = { ...this.data, ...saved };
      // ensure settings has all keys
      this.data.settings = { ...DEFAULT_SETTINGS, ...this.data.settings };
    }
  },
  render() { renderView(); }
};

// 
// UTILITIES
// 
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
function escHtml(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' });
}
function formatDateInput(ts) {
  if (!ts) return new Date().toISOString().slice(0,10);
  return new Date(ts).toISOString().slice(0,10);
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function pluralize(n, word) { return `${n} ${word}${n === 1 ? '' : 's'}`; }

function findTournament(id) { return App.data.tournaments.find(t => t.id === id); }
function findAthlete(id)    { return App.data.athletes.find(a => a.id === id); }

// 
// TOURNAMENT LOGIC
// 

/** Returns schedule options for given player count and format type */
function suggestFormats(count, type) {
  const exact = SCHEDULE_LIST.filter(s => s.type === type && s.size === count);
  return exact;
}

/** Build a new tournament object from wizard data */
function createTournament(w) {
  const now = Date.now();
  const scheduleId = w.scheduleId;
  const sched = scheduleId ? SCHEDULES[scheduleId] : null;
  const isSortSift = w.method === 'sortSift';

  const tournament = {
    id: uuid(),
    name: w.name.trim(),
    sport: (w.sport || '').trim(),
    notes: (w.notes || '').trim(),
    date: w.date || formatDateInput(now),
    status: 'setup',
    format: w.format,
    method: w.method,
    courts: w.courts || (sched ? sched.courts : 1),
    scoringType: w.scoringType,
    pointsTarget: Number(w.pointsTarget) || 15,
    timeLimitMinutes: Number(w.timeLimitMinutes) || 7,
    winBy2: !!w.winBy2,
    createdAt: now,
    completedAt: null,
    rounds: []
  };

  // Build player list (positions 1..N)
  const playerNames = (w.players || []).filter(p => p.trim());
  tournament.players = playerNames.map((name, i) => ({
    pos: i + 1,
    athleteId: w.athleteIds ? (w.athleteIds[i] || null) : null,
    name: name.trim()
  }));

  // Build initial round(s)
  if (!isSortSift && sched) {
    tournament.rounds = [buildRound(tournament.players, sched, 1, 'A')];
  } else if (isSortSift) {
    // groups built during setup, stored in w.groups
    const groups = w.groups || [];
    const round = { id: uuid(), roundNumber: 1, label: 'Round 1', groups: [] };
    groups.forEach((g, gi) => {
      const gsched = SCHEDULES[g.scheduleId];
      round.groups.push(buildGroup(g.players, gsched, gi));
    });
    tournament.rounds = [round];
  }

  return tournament;
}

function buildRound(players, sched, roundNumber, label) {
  return {
    id: uuid(),
    roundNumber,
    label,
    groups: [buildGroup(players, sched, 0)]
  };
}

function buildGroup(players, sched, groupIndex) {
  const label = String.fromCharCode(65 + groupIndex); // A, B, C...
  const games = [];
  sched.rounds.forEach(r => {
    r.slots.forEach(slot => {
      games.push({
        id: uuid(),
        gameLabel: r.label,
        courtNum: slot.court,
        t1: slot.t1,
        t2: slot.t2,
        out: slot.out || [],
        score1: null,
        score2: null,
        completed: false
      });
    });
  });
  return {
    id: uuid(),
    label,
    scheduleId: sched.id,
    players: players.map((p, i) => ({
      pos: i + 1,
      athleteId: p.athleteId || null,
      name: p.name || p,
      absent: false
    })),
    games
  };
}

/** Compute standings for a single group */
function computeGroupStandings(group) {
  const stats = {};
  group.players.forEach(p => {
    stats[p.pos] = { pos: p.pos, name: p.name, wins: 0, losses: 0, diff: 0, gamesPlayed: 0 };
  });

  group.games.forEach(g => {
    if (!g.completed || g.score1 == null || g.score2 == null) return;
    const s1 = Number(g.score1), s2 = Number(g.score2);
    const team1Won = s1 > s2;
    const d = s1 - s2;
    g.t1.forEach(pos => {
      if (stats[pos]) {
        stats[pos].wins    += team1Won ? 1 : 0;
        stats[pos].losses  += team1Won ? 0 : 1;
        stats[pos].diff    += d;
        stats[pos].gamesPlayed++;
      }
    });
    g.t2.forEach(pos => {
      if (stats[pos]) {
        stats[pos].wins    += team1Won ? 0 : 1;
        stats[pos].losses  += team1Won ? 1 : 0;
        stats[pos].diff    -= d;
        stats[pos].gamesPlayed++;
      }
    });
  });

  return Object.values(stats).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.diff !== a.diff) return b.diff - a.diff;
    return a.pos - b.pos; // tie-break: original position
  }).map((s, i) => ({ ...s, rank: i + 1 }));
}

/** Count completed games in a group */
function groupProgress(group) {
  const total = group.games.length;
  const done  = group.games.filter(g => g.completed).length;
  return { done, total, pct: total ? Math.round(done / total * 100) : 0 };
}

/** Get a group by round+group index */
function getGroup(tournament, rid, gid) {
  const round = tournament.rounds[rid];
  return round ? round.groups[gid] : null;
}


// 
// UI HELPERS
// 
const viewRoot   = () => document.getElementById('viewRoot');
const modalBack  = () => document.getElementById('modalBackdrop');
const modalTitle = () => document.getElementById('modalTitle');
const modalCont  = () => document.getElementById('modalContent');
const modalActs  = () => document.getElementById('modalActions');

function showModal(title, body, actions = '') {
  modalTitle().textContent = title;
  modalCont().innerHTML  = body;
  modalActs().innerHTML  = actions;
  modalBack().removeAttribute('hidden');
  modalBack().querySelector('.modal-close').focus();
}
function hideModal() { modalBack().setAttribute('hidden', ''); }

let _toastTimer = {};
function showToast(msg, type = 'info', duration = 3000) {
  const id = uuid();
  const icons = { success: '&#10003;', error: '&#10007;', warning: '&#9888;', info: '&#8505;' };
  const el = document.createElement('div');
  el.className = `toast toast-${type}`; el.id = `t-${id}`;
  el.innerHTML = `<span class="toast-icon">${icons[type]||'&#8505;'}</span>
    <span class="toast-msg">${escHtml(msg)}</span>
    <button class="toast-close" aria-label="Dismiss">&times;</button>`;
  document.getElementById('toastStack').appendChild(el);
  el.querySelector('.toast-close').addEventListener('click', () => removeToast(id));
  _toastTimer[id] = setTimeout(() => removeToast(id), duration);
}
function removeToast(id) {
  clearTimeout(_toastTimer[id]);
  const el = document.getElementById(`t-${id}`);
  if (el) el.remove();
}

function navigate(view, params = {}) {
  App.state = { ...App.state, view, ...params };
  renderView();
  // close mobile nav
  const mn = document.getElementById('mobileNav');
  if (mn) mn.setAttribute('hidden', '');
  const hb = document.getElementById('hamburger');
  if (hb) hb.setAttribute('aria-expanded', 'false');
  window.scrollTo(0, 0);
}

function setNavActive(view) {
  document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(b => {
    const active = b.dataset.nav === view;
    b.classList.toggle('active', active);
    b.setAttribute('aria-current', active ? 'page' : 'false');
  });
}

// 
// MAIN VIEW DISPATCHER
// 
function renderView() {
  const v = App.state.view;
  setNavActive(v);
  let html = '';
  switch (v) {
    case 'dashboard':   html = viewDashboard();   break;
    case 'tournaments': html = viewTournamentList(); break;
    case 'tournament':  html = viewTournamentDetail(); break;
    case 'wizard':      html = viewWizard();       break;
    case 'roster':      html = viewRoster();       break;
    case 'settings':    html = viewSettings();     break;
    default:            html = viewDashboard();
  }
  viewRoot().innerHTML = html;
  afterRender(v);
}

function afterRender(v) {
  if (v === 'wizard') initWizardUI();
}

// 
// DASHBOARD VIEW
// 
function viewDashboard() {
  const tournaments = App.data.tournaments;
  const athletes    = App.data.athletes;
  const active   = tournaments.filter(t => t.status === 'active').length;
  const complete = tournaments.filter(t => t.status === 'completed').length;
  const recent   = [...tournaments].sort((a,b) => b.createdAt - a.createdAt).slice(0,6);

  const recentCards = recent.length
    ? recent.map(t => {
        const prog = getTournamentProgress(t);
        return `<div class="recent-card" data-action="open-tournament" data-id="${t.id}">
          <div class="recent-card-status">
            <span class="badge badge-${statusBadge(t.status)}">${escHtml(t.status)}</span>
            <span class="text-xs text-muted">${formatDate(t.createdAt)}</span>
          </div>
          <div class="recent-card-name">${escHtml(t.name)}</div>
          <div class="recent-card-meta">
            ${escHtml(t.sport||'') ? `<span>${escHtml(t.sport)}</span>` : ''}
            <span>${pluralize(t.players?.length||0,'player')}</span> 
            <span>${escHtml(t.format)}</span>
          </div>
          ${t.status==='active'?`<div class="mt-2">
            <div class="progress-bar-wrap"><div class="progress-bar" style="width:${prog.pct}%"></div></div>
            <div class="text-xs text-muted mt-1">${prog.done}/${prog.total} games complete</div>
          </div>`:''}
        </div>`;
      }).join('')
    : `<div class="empty-state"><div class="empty-state-icon"></div>
        <h3>No tournaments yet</h3><p>Create your first tournament to get started.</p>
        <button class="btn btn-primary" data-action="new-tournament">New Tournament</button></div>`;

  return `<div class="page-header">
    <div><h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">Linear Ranking Tournament Designer</p></div>
    <div class="page-actions">
      <button class="btn btn-primary" data-action="new-tournament">+ New Tournament</button>
    </div>
  </div>
  <div class="stat-grid">
    <div class="stat-card"><div class="stat-label">Tournaments</div>
      <div class="stat-value">${tournaments.length}</div><div class="stat-sub">total</div></div>
    <div class="stat-card"><div class="stat-label">Active</div>
      <div class="stat-value">${active}</div><div class="stat-sub">in progress</div></div>
    <div class="stat-card"><div class="stat-label">Completed</div>
      <div class="stat-value">${complete}</div><div class="stat-sub">finished</div></div>
    <div class="stat-card"><div class="stat-label">Athletes</div>
      <div class="stat-value">${athletes.length}</div><div class="stat-sub">in roster</div></div>
  </div>
  <h2 class="text-xl font-bold mb-4" style="color:var(--clr-primary)">Recent Tournaments</h2>
  <div class="recent-grid">${recentCards}</div>`;
}

function statusBadge(status) {
  return { setup:'neutral', active:'primary', completed:'success' }[status] || 'neutral';
}

function getTournamentProgress(t) {
  let done = 0, total = 0;
  (t.rounds||[]).forEach(r => (r.groups||[]).forEach(g => {
    const p = groupProgress(g); done += p.done; total += p.total;
  }));
  return { done, total, pct: total ? Math.round(done/total*100) : 0 };
}

// 
// TOURNAMENT LIST VIEW
// 
function viewTournamentList() {
  const q = (App.state.search || '').toLowerCase();
  const list = App.data.tournaments
    .filter(t => !q || t.name.toLowerCase().includes(q) || (t.sport||'').toLowerCase().includes(q))
    .sort((a,b) => b.createdAt - a.createdAt);

  const rows = list.length
    ? list.map(t => {
        const prog = getTournamentProgress(t);
        return `<div class="tournament-row" data-action="open-tournament" data-id="${t.id}">
          <div class="tournament-row-main">
            <div class="tournament-row-name">${escHtml(t.name)}</div>
            <div class="tournament-row-meta">
              <span class="badge badge-${statusBadge(t.status)}">${escHtml(t.status)}</span>
              ${t.sport ? `<span>${escHtml(t.sport)}</span>` : ''}
              <span>${formatDate(t.createdAt)}</span>
              <span>${pluralize(t.players?.length||0,'player')}</span>
              <span>${escHtml(t.format)}  ${escHtml(t.method)}</span>
              ${t.status==='active' ? `<span>${prog.pct}% done</span>` : ''}
            </div>
          </div>
          <div class="tournament-row-actions">
            <button class="btn btn-sm btn-secondary" data-action="open-tournament" data-id="${t.id}">Open</button>
            <button class="btn btn-sm btn-ghost" data-action="delete-tournament" data-id="${t.id}">Delete</button>
          </div>
        </div>`;
      }).join('')
    : `<div class="empty-state"><div class="empty-state-icon">
        <h3>No tournaments${q?' found':''}</h3>
        <p>${q?'Try a different search.':'Create your first tournament to get started.'}</p>
        ${!q?`<button class="btn btn-primary" data-action="new-tournament">+ New Tournament</button>`:''}
       </div>`;

  return `<div class="page-header">
    <div><h1 class="page-title">Tournaments</h1>
      <p class="page-subtitle">${pluralize(App.data.tournaments.length,'tournament')} total</p></div>
    <div class="page-actions">
      <button class="btn btn-primary" data-action="new-tournament">+ New Tournament</button>
    </div>
  </div>
  <div class="search-bar">
    <input class="form-input search-input" id="searchInput" type="search"
      placeholder="Search tournaments..." value="${escHtml(App.state.search||'')}" />
  </div>
  <div class="tournament-list">${rows}</div>`;
}

// 
// TOURNAMENT WIZARD VIEW
// 
const WIZARD_STEPS = ['Info','Players','Format','Scoring','Review'];

function viewWizard() {
  const step = App.state.wStep;
  const w    = App.state.wData;

  const stepDots = WIZARD_STEPS.map((lbl, i) => {
    const s = i + 1;
    const state = s < step ? 'done' : s === step ? 'active' : '';
    const circle = s < step ? '&#10003;' : s;
    return `${i > 0 ? `<div class="wizard-connector ${s<=step?'done':''}"></div>` : ''}
      <div class="wizard-step ${state}">
        <div class="wizard-step-circle">${circle}</div>
        <div class="wizard-step-label">${escHtml(lbl)}</div>
      </div>`;
  }).join('');

  let body = '';
  if (step === 1) body = wizardStep1(w);
  else if (step === 2) body = wizardStep2(w);
  else if (step === 3) body = wizardStep3(w);
  else if (step === 4) body = wizardStep4(w);
  else                 body = wizardStep5(w);

  const isFirst = step === 1;
  const isLast  = step === WIZARD_STEPS.length;

  return `<div class="page-header">
    <div><h1 class="page-title">${w.editId ? 'Edit' : 'New'} Tournament</h1></div>
    <button class="btn btn-ghost" data-action="cancel-wizard">&#10005; Cancel</button>
  </div>
  <div class="wizard-steps">${stepDots}</div>
  <div class="wizard-body">
    <div class="card"><div class="card-body">
      ${body}
      <div class="wizard-nav">
        ${!isFirst ? `<button class="btn btn-ghost" data-action="wizard-back">&laquo; Back</button>` : '<span></span>'}
        ${!isLast
          ? `<button class="btn btn-primary" data-action="wizard-next">Next &raquo;</button>`
          : `<button class="btn btn-accent btn-lg" data-action="wizard-create">Create Tournament</button>`}
      </div>
    </div></div>
  </div>`;
}

function wizardStep1(w) {
  return `<h3 class="text-lg font-bold mb-4" style="color:var(--clr-primary)">Tournament Information</h3>
  <div class="form-group">
    <label class="form-label" for="w-name">Tournament Name <span style="color:red">*</span></label>
    <input class="form-input" id="w-name" type="text" maxlength="80"
      placeholder="e.g. Spring Rankings 2026" value="${escHtml(w.name||'')}">
  </div>
  <div class="form-row">
    <div class="form-group">
      <label class="form-label" for="w-sport">Sport / Activity</label>
      <input class="form-input" id="w-sport" type="text" maxlength="60"
        placeholder="e.g. Volleyball" value="${escHtml(w.sport||App.data.settings.defaultSport||'')}">
    </div>
    <div class="form-group">
      <label class="form-label" for="w-date">Date</label>
      <input class="form-input" id="w-date" type="date" value="${escHtml(w.date||formatDateInput())}">
    </div>
  </div>
  <div class="form-group">
    <label class="form-label" for="w-notes">Notes / Description</label>
    <textarea class="form-textarea" id="w-notes" rows="3"
      placeholder="Optional notes about this tournament...">${escHtml(w.notes||'')}</textarea>
  </div>`;
}

function wizardStep2(w) {
  const chips = (w.players||[]).map((p,i) =>
    `<div class="player-chip" data-pos="${i}">
       <span>${escHtml(p)}</span>
       <button class="remove-chip" data-action="remove-player" data-pos="${i}" aria-label="Remove ${escHtml(p)}">
     </div>`
  ).join('');

  const rosterOptions = App.data.athletes.length
    ? `<div class="mt-4">
        <label class="form-label">Add from Roster</label>
        <div class="flex gap-sm flex-wrap" id="rosterPicker">
          ${App.data.athletes
            .filter(a => !(w.players||[]).includes(a.name))
            .map(a => `<button class="btn btn-sm btn-ghost" data-action="add-roster-player"
              data-name="${escHtml(a.name)}" data-aid="${a.id}">${escHtml(a.name)}</button>`)
            .join('')}
        </div>
       </div>`
    : '';

  const importBtn = `<div class="mt-4">
    <label class="form-label">Import from CSV</label>
    <input type="file" id="playerCsvImport" accept=".csv,.txt" class="form-input" style="padding:.3rem">
    <div class="form-hint">One name per line, or comma-separated</div>
  </div>`;

  return `<h3 class="text-lg font-bold mb-4" style="color:var(--clr-primary)">Players</h3>
  <div class="player-list-input">
    <input class="form-input" id="playerInput" type="text" placeholder="Enter player name..." maxlength="60">
    <button class="btn btn-primary" data-action="add-player">Add</button>
  </div>
  <div class="form-hint mb-2">Press Enter or click Add. ${pluralize((w.players||[]).length,'player')} added.</div>
  <div class="player-chips" id="playerChips">${chips || '<span class="text-muted text-sm">No players added yet</span>'}</div>
  ${rosterOptions}
  ${importBtn}`;
}

function wizardStep3(w) {
  const count  = (w.players||[]).length;
  const fmt    = w.format || 'doubles';
  const method = w.method || 'single';

  // Method selection
  const methodHtml = `
  <div class="form-group">
    <label class="form-label">Tournament Method</label>
    <div class="radio-group">
      <label class="radio-card ${method==='single'?'selected':''}">
        <input type="radio" name="w-method" value="single" ${method==='single'?'checked':''}>
        <div><div class="radio-card-title">Single Closed Cell</div>
          <div class="radio-card-desc">All players in one group  most accurate linear ranking. Best for exact group sizes.</div>
        </div>
      </label>
      <label class="radio-card ${method==='sortSift'?'selected':''}">
        <input type="radio" name="w-method" value="sortSift" ${method==='sortSift'?'checked':''}>
        <div><div class="radio-card-title">Sort &amp; Sift (Multi-Group)</div>
          <div class="radio-card-desc">Split into sub-groups across courts. Use for large groups or non-standard sizes. Multiple rounds refine rankings.</div>
        </div>
      </label>
    </div>
  </div>`;

  // Format selection
  const fmtHtml = `
  <div class="form-group">
    <label class="form-label">Game Format</label>
    <div class="radio-group">
      <label class="radio-card ${fmt==='doubles'?'selected':''}">
        <input type="radio" name="w-format" value="doubles" ${fmt==='doubles'?'checked':''}>
        <div><div class="radio-card-title">Doubles (2v2)</div>
          <div class="radio-card-desc">Each player partners with every other player once; opposes each player twice.</div>
        </div>
      </label>
      <label class="radio-card ${fmt==='triples'?'selected':''}">
        <input type="radio" name="w-format" value="triples" ${fmt==='triples'?'checked':''}>
        <div><div class="radio-card-title">Triples (3v3)</div>
          <div class="radio-card-desc">Each player partners with every other twice; opposes each player three times.</div>
        </div>
      </label>
    </div>
  </div>`;

  // Court count
  const maxCourts = 10;
  const courts = w.courts || 1;
  const courtsHtml = `
  <div class="form-group">
    <label class="form-label" for="w-courts">Number of Courts Available</label>
    <input class="form-input" id="w-courts" type="number" min="1" max="${maxCourts}"
      value="${courts}" style="max-width:120px">
    <div class="form-hint">How many courts can run simultaneously?</div>
  </div>`;

  // Schedule suggestion
  const schedHtml = buildScheduleSuggestions(count, fmt, method, courts, w.scheduleId, w.subsetConfig);

  return `<h3 class="text-lg font-bold mb-4" style="color:var(--clr-primary)">Tournament Format</h3>
  <div class="alert alert-info"><span class="alert-icon">&#8505;</span>
    <span>${pluralize(count,'player')} entered. Choose format and courts.</span>
  </div>
  ${methodHtml}${fmtHtml}${courtsHtml}
  <div id="schedSuggestions">${schedHtml}</div>`;
}

function buildScheduleSuggestions(count, fmt, method, courts, selectedId, selectedSubset) {
  if (method === 'single') {
    const matches = suggestFormats(count, fmt);
    if (!matches.length) {
      return `<div class="alert alert-warning"><span class="alert-icon">&#9888;</span>
        <span>No exact single-cell schedule for ${count} ${fmt} players. Use Sort &amp; Sift method or adjust player count.</span>
      </div>`;
    }
    const cards = matches.map(s => `
      <div class="format-card ${selectedId===s.id?'selected':''}" data-action="select-schedule" data-id="${s.id}">
        <div class="format-card-head">
          <span class="format-card-title">${escHtml(s.name)}</span>
          <span class="badge badge-primary">${s.courts} court${s.courts>1?'s':''}</span>
        </div>
        <div class="format-card-body">${s.gameCount} rounds  ${s.size} players</div>
        <div class="format-card-detail">Each player plays with every other once as partner, against every other twice as opponent.</div>
      </div>`).join('');
    return `<div class="form-group"><label class="form-label">Schedule</label>
      <div class="format-cards">${cards}</div></div>`;
  }

  // Sort-sift: show subset options
  const opts = findSubsetOptions(count, courts, fmt);
  if (!opts.length) {
    return `<div class="alert alert-warning"><span class="alert-icon">&#9888;</span>
      <span>Cannot split ${count} ${fmt} players across ${courts} court${courts>1?'s':''} evenly with valid group sizes (4,5 for doubles; 7,9 for triples). Adjust player count or courts.</span>
    </div>`;
  }
  const subsetStr = selectedSubset ? selectedSubset.join(',') : '';
  const cards = opts.map(opt => {
    const key = opt.join(',');
    const labels = opt.map(sz => {
      const sched = SCHEDULE_LIST.find(s => s.type===fmt && s.size===sz && s.courts===1);
      return sched ? escHtml(sched.name) : `${sz} players`;
    });
    return `<div class="format-card ${subsetStr===key?'selected':''}" data-action="select-subset" data-key="${escHtml(key)}">
      <div class="format-card-title">${escHtml(opt.join(' + '))} players</div>
      <div class="format-card-body">${labels.join(' | ')}</div>
      <div class="format-card-detail">${opt.length} group${opt.length>1?'s':''}, one per court</div>
    </div>`;
  }).join('');
  return `<div class="form-group"><label class="form-label">Group Split Options</label>
    <div class="format-cards">${cards}</div></div>`;
}

function wizardStep4(w) {
  const type = w.scoringType || App.data.settings.defaultScoringType;
  const pt   = w.pointsTarget ?? App.data.settings.defaultPointsTarget;
  const tm   = w.timeLimitMinutes ?? App.data.settings.defaultTimeLimitMinutes;
  const wb2  = w.winBy2 ?? App.data.settings.defaultWinBy2;

  return `<h3 class="text-lg font-bold mb-4" style="color:var(--clr-primary)">Scoring Format</h3>
  <div class="form-group">
    <label class="form-label">Scoring Type</label>
    <div class="radio-group">
      <label class="radio-card ${type==='points'?'selected':''}">
        <input type="radio" name="w-scoring" value="points" ${type==='points'?'checked':''}>
        <div><div class="radio-card-title">Points  First to X</div>
          <div class="radio-card-desc">Play until one team reaches the target score.</div>
        </div>
      </label>
      <label class="radio-card ${type==='timed'?'selected':''}">
        <input type="radio" name="w-scoring" value="timed" ${type==='timed'?'checked':''}>
        <div><div class="radio-card-title">Timed</div>
          <div class="radio-card-desc">Play for a fixed number of minutes; highest score wins.</div>
        </div>
      </label>
    </div>
  </div>
  <div id="scoringDetails">
    ${type==='points' ? `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="w-points">Points to Win</label>
          <input class="form-input" id="w-points" type="number" min="1" max="100" value="${pt}" style="max-width:120px">
        </div>
        <div class="form-group" style="padding-top:1.9rem">
          <label class="form-check">
            <input type="checkbox" id="w-winby2" ${wb2?'checked':''}>
            <span class="form-check-label">Win by 2 points</span>
          </label>
        </div>
      </div>` : `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="w-time">Time Limit (minutes)</label>
          <input class="form-input" id="w-time" type="number" min="1" max="60" value="${tm}" style="max-width:120px">
          <div class="form-hint">Bjerring recommends 7 minutes minimum.</div>
        </div>
        <div class="form-group" style="padding-top:1.9rem">
          <label class="form-check">
            <input type="checkbox" id="w-winby2" ${wb2?'checked':''}>
            <span class="form-check-label">Win by 2 points (at time limit)</span>
          </label>
        </div>
      </div>`}
  </div>`;
}

function wizardStep5(w) {
  const count  = (w.players||[]).length;
  const sched  = w.scheduleId ? SCHEDULES[w.scheduleId] : null;
  const scoring = w.scoringType === 'timed'
    ? `Timed  ${w.timeLimitMinutes||7} min`
    : `First to ${w.pointsTarget||15}${w.winBy2?' (win by 2)':''}`;

  const playerList = (w.players||[]).map((p,i) =>
    `<div class="group-player-row"><span class="group-player-pos">${i+1}</span><span>${escHtml(p)}</span></div>`
  ).join('');

  const schedInfo = sched
    ? `<strong>${escHtml(sched.name)}</strong>  ${sched.gameCount} rounds, ${sched.courts} court${sched.courts>1?'s':''}`
    : w.method === 'sortSift' && w.subsetConfig
      ? `Sort &amp; Sift: groups of ${escHtml(w.subsetConfig.join(' + '))}`
      : '<em>No schedule selected</em>';

  return `<h3 class="text-lg font-bold mb-4" style="color:var(--clr-primary)">Review &amp; Create</h3>
  <div class="card mb-4"><div class="card-body">
    <div class="form-row mb-4">
      <div><div class="form-label">Name</div><div class="font-bold">${escHtml(w.name||'')}</div></div>
      <div><div class="form-label">Sport</div><div>${escHtml(w.sport||'')}</div></div>
      <div><div class="form-label">Date</div><div>${escHtml(w.date||'')}</div></div>
    </div>
    <div class="form-row mb-4">
      <div><div class="form-label">Format</div><div>${escHtml(w.format||'')}</div></div>
      <div><div class="form-label">Method</div><div>${escHtml(w.method||'')}</div></div>
      <div><div class="form-label">Scoring</div><div>${scoring}</div></div>
    </div>
    <div><div class="form-label">Schedule</div><div>${schedInfo}</div></div>
  </div></div>
  <div class="card"><div class="card-header"><span class="card-title">${pluralize(count,'Player')}</span></div>
    <div class="card-body" style="max-height:260px;overflow-y:auto">${playerList}</div>
  </div>
  <div class="alert alert-success mt-4"><span class="alert-icon">&#10003;</span>
    <span>Ready to create! Click <strong>Create Tournament</strong> to begin.</span>
  </div>`;
}

function initWizardUI() {
  // Wire up player input enter key
  const inp = document.getElementById('playerInput');
  if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); doAddPlayer(); } });
  // Wire up player CSV import
  const csvInput = document.getElementById('playerCsvImport');
  if (csvInput) csvInput.addEventListener('change', e => importPlayerCSV(e.target));
  // Wire up scoring radio changes
  document.querySelectorAll('input[name="w-scoring"]').forEach(r =>
    r.addEventListener('change', () => updateWizardScoring(r.value)));
}

function updateWizardScoring(type) {
  App.state.wData.scoringType = type;
  // re-render scoring details
  const details = document.getElementById('scoringDetails');
  if (!details) return;
  const w = App.state.wData;
  const pt = w.pointsTarget ?? App.data.settings.defaultPointsTarget;
  const tm = w.timeLimitMinutes ?? App.data.settings.defaultTimeLimitMinutes;
  const wb2 = w.winBy2 ?? false;
  details.innerHTML = type === 'points'
    ? `<div class="form-row">
        <div class="form-group"><label class="form-label" for="w-points">Points to Win</label>
          <input class="form-input" id="w-points" type="number" min="1" max="100" value="${pt}" style="max-width:120px"></div>
        <div class="form-group" style="padding-top:1.9rem">
          <label class="form-check"><input type="checkbox" id="w-winby2" ${wb2?'checked':''}>
            <span class="form-check-label">Win by 2</span></label></div></div>`
    : `<div class="form-row">
        <div class="form-group"><label class="form-label" for="w-time">Time Limit (min)</label>
          <input class="form-input" id="w-time" type="number" min="1" max="60" value="${tm}" style="max-width:120px">
          <div class="form-hint">Bjerring recommends 7 min minimum.</div></div>
        <div class="form-group" style="padding-top:1.9rem">
          <label class="form-check"><input type="checkbox" id="w-winby2" ${wb2?'checked':''}>
            <span class="form-check-label">Win by 2</span></label></div></div>`;
}

// 
// WIZARD DATA COLLECTION HELPERS
// 
function collectStep1() {
  return {
    name:  document.getElementById('w-name')?.value?.trim() || '',
    sport: document.getElementById('w-sport')?.value?.trim() || '',
    date:  document.getElementById('w-date')?.value || formatDateInput(),
    notes: document.getElementById('w-notes')?.value?.trim() || ''
  };
}
function collectStep3() {
  const method  = document.querySelector('input[name="w-method"]:checked')?.value || 'single';
  const format  = document.querySelector('input[name="w-format"]:checked')?.value || 'doubles';
  const courts  = parseInt(document.getElementById('w-courts')?.value) || 1;
  return { method, format, courts };
}
function collectStep4() {
  const type = document.querySelector('input[name="w-scoring"]:checked')?.value || 'points';
  return {
    scoringType: type,
    pointsTarget:    parseInt(document.getElementById('w-points')?.value) || 15,
    timeLimitMinutes: parseInt(document.getElementById('w-time')?.value) || 7,
    winBy2: document.getElementById('w-winby2')?.checked || false
  };
}
function validateStep(step) {
  if (step === 1) {
    const name = document.getElementById('w-name')?.value?.trim();
    if (!name) { showToast('Tournament name is required.', 'error'); return false; }
  }
  if (step === 2) {
    const count = (App.state.wData.players||[]).length;
    if (count < 4) { showToast('Add at least 4 players.', 'error'); return false; }
  }
  if (step === 3) {
    const w = App.state.wData;
    if (w.method === 'single' && !w.scheduleId) {
      showToast('Select a schedule or switch to Sort & Sift.', 'error'); return false;
    }
    if (w.method === 'sortSift' && !w.subsetConfig) {
      showToast('Select a group split option.', 'error'); return false;
    }
  }
  return true;
}

function doAddPlayer() {
  const inp = document.getElementById('playerInput');
  if (!inp) return;
  const name = inp.value.trim();
  if (!name) return;
  if (!App.state.wData.players) App.state.wData.players = [];
  App.state.wData.players.push(name);
  inp.value = '';
  renderView();
  document.getElementById('playerInput')?.focus();
}

function importPlayerCSV(input) {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const lines = e.target.result.split(/[\r\n,]+/).map(s => s.trim()).filter(Boolean);
    if (!App.state.wData.players) App.state.wData.players = [];
    lines.forEach(name => App.state.wData.players.push(name));
    renderView();
    showToast(`Added ${lines.length} players from CSV.`, 'success');
  };
  reader.readAsText(file);
}


// 
// TOURNAMENT DETAIL VIEW
// 
function viewTournamentDetail() {
  const t = findTournament(App.state.tid);
  if (!t) return `<div class="alert alert-danger">Tournament not found. <button class="btn btn-sm btn-ghost" data-action="go-tournaments">Back</button></div>`;

  const tab  = App.state.tab || 'schedule';
  const tabs = ['schedule','scores','standings','export'];
  const tabBar = tabs.map(tb =>
    `<button class="tab-btn ${tab===tb?'active':''}" data-action="set-tab" data-tab="${tb}">${tb.charAt(0).toUpperCase()+tb.slice(1)}</button>`
  ).join('');

  const prog  = getTournamentProgress(t);
  const isDone = t.status === 'completed';

  let body = '';
  if (tab === 'schedule')   body = tabSchedule(t);
  else if (tab === 'scores')    body = tabScores(t);
  else if (tab === 'standings') body = tabStandings(t);
  else                          body = tabExport(t);

  const completeBtn = t.status === 'active'
    ? `<button class="btn btn-success" data-action="complete-tournament" data-id="${t.id}"> Mark Complete</button>`
    : t.status === 'completed'
      ? `<span class="badge badge-success">Completed ${formatDate(t.completedAt)}</span>`
      : `<button class="btn btn-primary" data-action="start-tournament" data-id="${t.id}"> Start Tournament</button>`;

  return `<div class="page-header">
    <div>
      <button class="btn btn-ghost btn-sm mb-2" data-action="go-tournaments">&laquo; Tournaments</button>
      <h1 class="page-title">${escHtml(t.name)}</h1>
      <p class="page-subtitle">
        ${t.sport?escHtml(t.sport)+'  ':''}${escHtml(t.format)}  ${escHtml(t.method==='sortSift'?'Sort & Sift':'Single Cell')} 
        ${escHtml(t.scoringType==='timed'?`${t.timeLimitMinutes} min games`:`First to ${t.pointsTarget}${t.winBy2?' (win by 2)':''}`)}</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-ghost" data-action="print-schedule" data-id="${t.id}"> Schedule</button>
      <button class="btn btn-ghost" data-action="print-scoresheet" data-id="${t.id}"> Scoresheet</button>
      ${completeBtn}
    </div>
  </div>
  ${t.status==='active'?`<div class="mb-4">
    <div style="display:flex;justify-content:space-between;margin-bottom:.25rem">
      <span class="text-sm text-muted">Progress</span><span class="text-sm text-muted">${prog.done}/${prog.total} games</span>
    </div>
    <div class="progress-bar-wrap"><div class="progress-bar" style="width:${prog.pct}%"></div></div>
  </div>`:''}
  <div class="tab-bar">${tabBar}</div>
  ${body}`;
}

//  Schedule Tab 
function tabSchedule(t) {
  const html = t.rounds.map((round, ri) =>
    round.groups.map((group, gi) => {
      const sched = SCHEDULES[group.scheduleId];
      const showGroupLabel = t.rounds.length > 1 || round.groups.length > 1;
      const header = showGroupLabel ? `<h3 class="text-lg font-bold mt-4 mb-2" style="color:var(--clr-primary)">${escHtml(round.label)}  Group ${escHtml(group.label)}</h3>` : '';
      const rows = buildScheduleRows(group, sched);
      return header + `<div class="table-wrapper mb-4">
        <table class="data-table schedule-table">
          <thead><tr>
            <th>Round</th><th>Court</th><th>Team 1</th><th>vs</th><th>Team 2</th><th>Out</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table></div>`;
    }).join('')
  ).join('');
  return html || '<div class="empty-state"><p>No schedule generated.</p></div>';
}

function buildScheduleRows(group, sched) {
  if (!sched) return '';
  const rows = [];
  sched.rounds.forEach(r => {
    r.slots.forEach(slot => {
      const names1 = slot.t1.map(pos => escHtml(playerName(group, pos))).join(' / ');
      const names2 = slot.t2.map(pos => escHtml(playerName(group, pos))).join(' / ');
      const outNames = slot.out.map(pos => escHtml(playerName(group, pos))).join(', ');
      rows.push(`<tr>
        <td><span class="badge badge-primary">${escHtml(r.label)}</span></td>
        <td class="court-cell">Court ${slot.court}</td>
        <td class="teams-cell">${names1}</td>
        <td class="text-muted">vs</td>
        <td class="teams-cell">${names2}</td>
        <td>${outNames?`<span class="out-badge">${outNames} out</span>`:''}</td>
      </tr>`);
    });
  });
  return rows.join('');
}

function playerName(group, pos) {
  const p = group.players.find(p => p.pos === pos);
  return p ? `#${pos} ${p.name}` : `#${pos}`;
}

//  Scores Tab 
function tabScores(t) {
  const rid = App.state.rid || 0;
  const gid = App.state.gid || 0;
  const group = getGroup(t, rid, gid);
  if (!group) return '<div class="alert alert-warning">No group found.</div>';

  const roundGroupTabs = buildRoundGroupTabs(t, rid, gid);
  const sched = SCHEDULES[group.scheduleId];
  const progress = groupProgress(group);

  // Group games by round label
  const byRound = {};
  group.games.forEach(g => {
    if (!byRound[g.gameLabel]) byRound[g.gameLabel] = [];
    byRound[g.gameLabel].push(g);
  });

  const cards = Object.entries(byRound).map(([label, games]) =>
    games.map(g => {
      const team1 = g.t1.map(pos => escHtml(playerName(group, pos))).join(' & ');
      const team2 = g.t2.map(pos => escHtml(playerName(group, pos))).join(' & ');
      const outNames = g.out.map(pos => escHtml(playerName(group, pos))).join(', ');
      const s1 = g.score1 ?? '';
      const s2 = g.score2 ?? '';
      return `<div class="score-card ${g.completed?'completed':''}" data-game-id="${g.id}">
        <div class="score-card-header">
          <span class="score-card-label">Round ${escHtml(label)}  Court ${g.courtNum}</span>
          ${g.completed?'<span class="badge badge-success">Done</span>':''}
        </div>
        <div class="score-teams">
          <span class="score-team">${team1}</span>
          <span class="score-vs">vs</span>
          <span class="score-team">${team2}</span>
        </div>
        <div class="score-inputs">
          <input class="score-field" type="number" min="0" max="999"
            data-game="${g.id}" data-side="1" value="${escHtml(String(s1))}"
            placeholder="0" aria-label="Score team 1">
          <span class="score-dash">-</span>
          <input class="score-field" type="number" min="0" max="999"
            data-game="${g.id}" data-side="2" value="${escHtml(String(s2))}"
            placeholder="0" aria-label="Score team 2">
        </div>
        ${outNames?`<div class="score-out">Out: ${outNames}</div>`:''}
        <button class="btn btn-sm btn-primary save-score-btn" data-action="save-score" data-game="${g.id}">
          ${g.completed?' Update':'Save Score'}
        </button>
      </div>`;
    }).join('')
  ).join('');

  return `${roundGroupTabs}
  <div class="flex items-center justify-between mb-4">
    <span class="text-muted text-sm">${progress.done}/${progress.total} games complete</span>
    <button class="btn btn-sm btn-ghost" data-action="mark-all-remaining" data-rid="${rid}" data-gid="${gid}">Mark remaining complete</button>
  </div>
  <div class="score-entry-grid">${cards}</div>`;
}

//  Standings Tab 
function tabStandings(t) {
  const rid = App.state.rid || 0;
  const gid = App.state.gid || 0;
  const roundGroupTabs = buildRoundGroupTabs(t, rid, gid);

  const allGroups = t.rounds.map((r, ri) =>
    r.groups.map((g, gi) => ({ g, ri, gi, roundLabel: r.label }))
  ).flat();

  const tables = allGroups.map(({ g, ri, gi, roundLabel }) => {
    const standings = computeGroupStandings(g);
    const showLabel = allGroups.length > 1;
    const header = showLabel ? `<h3 class="text-lg font-bold mb-2" style="color:var(--clr-primary)">${escHtml(roundLabel)}  Group ${escHtml(g.label)}</h3>` : '';
    const rows = standings.map(s => {
      const rankClass = s.rank <= 3 ? `rank-${s.rank}` : '';
      return `<tr>
        <td class="rank-cell ${rankClass}">${s.rank === 1 ? '#1' : s.rank === 2 ? '#2' : s.rank === 3 ? '#3' : s.rank}</td>
        <td class="name-cell">${escHtml(s.name)}</td>
        <td class="score-cell">${s.wins}</td>
        <td class="score-cell">${s.losses}</td>
        <td class="score-cell ${s.diff >= 0 ? '' : 'text-muted'}">${s.diff > 0 ? '+' : ''}${s.diff}</td>
        <td class="score-cell">${s.gamesPlayed}</td>
      </tr>`;
    }).join('');
    return `${header}<div class="table-wrapper mb-4">
      <table class="data-table">
        <thead><tr>
          <th>Rank</th><th>Player</th><th>W</th><th>L</th><th>Pts +/-</th><th>GP</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
  }).join('');

  // Sort-sift: show advancement guide
  const sortSiftNote = t.method === 'sortSift' && t.rounds.length > 0
    ? `<div class="alert alert-info mt-4"><span class="alert-icon">&#8505;</span>
        <span><strong>Sort &amp; Sift:</strong> After all groups complete, top-ranked players advance to the next round's top group.
        <button class="btn btn-sm btn-primary" data-action="add-round" data-id="${t.id}" style="margin-left:.5rem">+ Add Next Round</button></span>
       </div>` : '';

  return `<div>${tables}${sortSiftNote}</div>`;
}

//  Export Tab 
function tabExport(t) {
  return `<div class="settings-section">
    <h3>Export Tournament Data</h3>
    <div class="settings-grid">
      <div class="card"><div class="card-body">
        <div class="font-bold mb-2">JSON</div>
        <p class="text-sm text-muted mb-4">Complete tournament data including all scores and standings.</p>
        <button class="btn btn-primary btn-full" data-action="export-tournament-json" data-id="${t.id}">Export JSON</button>
      </div></div>
      <div class="card"><div class="card-body">
        <div class="font-bold mb-2">Excel / CSV</div>
        <p class="text-sm text-muted mb-4">Standings and schedule as a spreadsheet.</p>
        <button class="btn btn-primary btn-full" data-action="export-tournament-xlsx" data-id="${t.id}">Export XLSX</button>
        <button class="btn btn-secondary btn-full mt-2" data-action="export-tournament-csv" data-id="${t.id}">Export CSV</button>
      </div></div>
      <div class="card"><div class="card-body">
        <div class="font-bold mb-2">Import Tournament</div>
        <p class="text-sm text-muted mb-4">Replace this tournament's data from a JSON file.</p>
        <input type="file" id="importTournamentFile" accept=".json" class="form-input mb-2" style="padding:.3rem">
        <button class="btn btn-secondary btn-full" data-action="import-tournament-file">Import JSON</button>
      </div></div>
    </div>
  </div>`;
}

function buildRoundGroupTabs(t, activeRid, activeGid) {
  if (t.rounds.length === 1 && t.rounds[0].groups.length === 1) return '';
  const tabs = t.rounds.flatMap((r, ri) =>
    r.groups.map((g, gi) =>
      `<button class="tab-btn ${ri===activeRid&&gi===activeGid?'active':''}"
         data-action="set-group-tab" data-rid="${ri}" data-gid="${gi}">
         ${t.rounds.length>1?escHtml(r.label)+'  ':''}Group ${escHtml(g.label)}
       </button>`
    )
  ).join('');
  return `<div class="tab-bar" style="margin-bottom:1rem">${tabs}</div>`;
}

// 
// ROSTER VIEW
// 
function viewRoster() {
  const q = (App.state.search || '').toLowerCase();
  const athletes = App.data.athletes
    .filter(a => !q || a.name.toLowerCase().includes(q))
    .sort((a,b) => a.name.localeCompare(b.name));

  const rows = athletes.map(a => `<tr>
    <td class="name-cell">${escHtml(a.name)}</td>
    <td>${escHtml(a.notes||'')}</td>
    <td>${formatDate(a.createdAt)}</td>
    <td>
      <button class="btn btn-sm btn-ghost" data-action="edit-athlete" data-id="${a.id}">Edit</button>
      <button class="btn btn-sm btn-ghost" style="color:var(--clr-danger)" data-action="delete-athlete" data-id="${a.id}">Delete</button>
    </td>
  </tr>`).join('');

  return `<div class="page-header">
    <div><h1 class="page-title">Athlete Roster</h1>
      <p class="page-subtitle">${pluralize(App.data.athletes.length,'athlete')} total</p></div>
    <div class="page-actions">
      <a class="btn btn-ghost" href="roster-template.csv" download="roster-template.csv">CSV Template</a>
      <button class="btn btn-ghost" data-action="import-roster">Import CSV</button>
      <button class="btn btn-ghost" data-action="export-roster">Export CSV</button>
      <button class="btn btn-primary" data-action="add-athlete">+ Add Athlete</button>
    </div>
  </div>
  <div class="search-bar">
    <input class="form-input search-input" id="searchInput" type="search"
      placeholder="Search athletes..." value="${escHtml(App.state.search||'')}">
  </div>
  <div class="card">
    <div class="table-wrapper">
      <table class="data-table roster-table">
        <thead><tr><th>Name</th><th>Notes</th><th>Added</th><th></th></tr></thead>
        <tbody>${rows || `<tr><td colspan="4"><div class="empty-state" style="padding:2rem">
          <div class="empty-state-icon"></div><h3>No athletes${q?' found':''}</h3>
          <p>${q?'Try a different search.':'Add athletes to build your roster.'}</p>
          ${!q?`<button class="btn btn-primary" data-action="add-athlete">+ Add Athlete</button>`:''}
        </div></td></tr>`}</tbody>
      </table>
    </div>
  </div>`;
}

// 
// SETTINGS VIEW
// 
function viewSettings() {
  const s = App.data.settings;
  return `<div class="page-header">
    <div><h1 class="page-title">Settings</h1><p class="page-subtitle">App configuration and data management</p></div>
  </div>
  <div class="settings-section">
    <h3>Default Tournament Defaults</h3>
    <div class="card"><div class="card-body">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="s-sport">Default Sport</label>
          <input class="form-input" id="s-sport" type="text" value="${escHtml(s.defaultSport||'')}">
        </div>
        <div class="form-group">
          <label class="form-label" for="s-scoring">Default Scoring Type</label>
          <select class="form-select" id="s-scoring">
            <option value="points" ${s.defaultScoringType==='points'?'selected':''}>Points (First to X)</option>
            <option value="timed" ${s.defaultScoringType==='timed'?'selected':''}>Timed</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="s-points">Default Points Target</label>
          <input class="form-input" id="s-points" type="number" min="1" max="100" value="${s.defaultPointsTarget||15}" style="max-width:120px">
        </div>
        <div class="form-group">
          <label class="form-label" for="s-time">Default Time Limit (min)</label>
          <input class="form-input" id="s-time" type="number" min="1" max="60" value="${s.defaultTimeLimitMinutes||7}" style="max-width:120px">
        </div>
        <div class="form-group" style="padding-top:1.9rem">
          <label class="form-check">
            <input type="checkbox" id="s-winby2" ${s.defaultWinBy2?'checked':''}>
            <span class="form-check-label">Win by 2 (default)</span>
          </label>
        </div>
      </div>
      <button class="btn btn-primary" data-action="save-settings">Save Settings</button>
    </div></div>
  </div>
  <div class="settings-section">
    <h3>Data Management</h3>
    <div class="settings-grid">
      <div class="card"><div class="card-body">
        <div class="font-bold mb-2">Backup All Data</div>
        <p class="text-sm text-muted mb-4">Export all tournaments and roster as a single JSON backup.</p>
        <button class="btn btn-primary btn-full" data-action="export-all-json"> Export Backup</button>
      </div></div>
      <div class="card"><div class="card-body">
        <div class="font-bold mb-2">Restore from Backup</div>
        <p class="text-sm text-muted mb-4">Import a full backup JSON file. <strong>Replaces all current data.</strong></p>
        <input type="file" id="restoreFile" accept=".json" class="form-input mb-2" style="padding:.3rem">
        <button class="btn btn-secondary btn-full" data-action="import-all-json">Restore Backup</button>
      </div></div>
      <div class="card"><div class="card-body">
        <div class="font-bold mb-2">Clear All Data</div>
        <p class="text-sm text-muted mb-4">Permanently delete all tournaments and roster data. Cannot be undone.</p>
        <button class="btn btn-danger btn-full" data-action="clear-all-data"> Clear All Data</button>
      </div></div>
    </div>
  </div>
  <div class="settings-section">
    <h3>About</h3>
    <div class="card"><div class="card-body">
      <p class="text-sm"><strong>Linear Ranking Tournament Designer</strong> v1.0.0</p>
      <p class="text-sm text-muted mt-1">Based on the Bjerring Linear Ranking Tournament system, as described in <em>Linear Ranking Tournaments</em> by Michael P. Fleming.</p>
      <p class="text-sm text-muted mt-1"> 2026 Jared Mathes  <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a></p>
    </div></div>
  </div>`;
}


// 
// PRINT MODULE
// 
function printSchedule(tid) {
  const t = findTournament(tid);
  if (!t) return;
  const pages = t.rounds.map((r, ri) =>
    r.groups.map((group, gi) => {
      const sched = SCHEDULES[group.scheduleId];
      const showLabel = t.rounds.length > 1 || r.groups.length > 1;
      const groupTitle = showLabel ? `  ${r.label} Group ${group.label}` : '';
      const rows = sched ? sched.rounds.map(round =>
        round.slots.map(slot => {
          const t1Names = slot.t1.map(p => printPlayerName(group, p)).join(' & ');
          const t2Names = slot.t2.map(p => printPlayerName(group, p)).join(' & ');
          const outNames = slot.out.map(p => printPlayerName(group, p)).join(', ');
          return `<tr>
            <td style="font-weight:bold;text-align:center">${round.label}</td>
            <td>${slot.court}</td>
            <td>${t1Names}</td><td style="text-align:center">vs</td>
            <td>${t2Names}</td>
            <td>${outNames || ''}</td>
          </tr>`;
        }).join('')
      ).join('') : '';

      return `<div class="print-page">
        <div class="print-title">LINEAR RANKING TOURNAMENT  SCHEDULE${groupTitle}</div>
        <div class="print-subtitle">${t.name}  ${t.sport||''}  ${formatDate(new Date(t.date).getTime())}</div>
        <div class="print-subtitle">
          ${t.scoringType==='timed'?`Timed  ${t.timeLimitMinutes} min`:
            `First to ${t.pointsTarget}${t.winBy2?' (win by 2)':''}`} |
          Format: ${t.format}
        </div>
        <br>
        <table class="print-table">
          <thead><tr><th>Round</th><th>Court</th><th>Team 1</th><th>vs</th><th>Team 2</th><th>Out</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <br>
        <div style="font-size:8pt;color:#555">
          Players: ${group.players.map(p => `#${p.pos} ${p.name}`).join('  ')}
        </div>
      </div>`;
    }).join('')
  ).join('');

  doPrint(pages);
}

function printScoresheet(tid) {
  const t = findTournament(tid);
  if (!t) return;
  const pages = t.rounds.map((r, ri) =>
    r.groups.map((group, gi) => {
      const sched = SCHEDULES[group.scheduleId];
      const showLabel = t.rounds.length > 1 || r.groups.length > 1;
      const groupTitle = showLabel ? `  ${r.label} Group ${group.label}` : '';
      const gameLabels = sched ? sched.rounds.map(r => r.label) : [];
      const schedSummary = sched ? sched.rounds.map(r =>
        r.slots.map(s => `${r.label}: ${s.t1.join(',')} v ${s.t2.join(',')}`).join(' | ')
      ).join('  ') : '';

      const headerCols = gameLabels.map(l => `<th class="game-col">${l}</th>`).join('');
      const rows = group.players.map(p => {
        const gameCells = gameLabels.map(label => {
          const game = group.games.find(g => g.gameLabel === label);
          if (!game) return '<td></td>';
          if (game.out.includes(p.pos)) return '<td style="background:#eee;font-size:7pt;text-align:center">OUT</td>';
          if (game.completed) {
            const onTeam1 = game.t1.includes(p.pos);
            const diff = onTeam1 ? (game.score1||0)-(game.score2||0) : (game.score2||0)-(game.score1||0);
            return `<td style="text-align:center;font-weight:bold">${diff>0?'+':''}${diff}</td>`;
          }
          return '<td><div class="print-score-box"></div></td>';
        }).join('');
        const stats = computePlayerStat(group, p.pos);
        return `<tr>
          <td style="text-align:center;font-weight:bold">${p.pos}</td>
          <td class="name-col">${p.name}</td>
          ${gameCells}
          <td style="text-align:center;font-weight:bold">${stats.wins}</td>
          <td style="text-align:center">${stats.losses}</td>
          <td style="text-align:center;font-weight:bold">${stats.diff>0?'+':''}${stats.diff}</td>
          <td style="text-align:center;font-weight:bold">${stats.rank||''}</td>
        </tr>`;
      }).join('');

      return `<div class="print-page">
        <div class="print-title">LINEAR RANKING TOURNAMENT  SCORESHEET${groupTitle}</div>
        <div class="print-subtitle">${t.name}  ${t.sport||''}  ${formatDate(new Date(t.date).getTime())}</div>
        <div class="print-subtitle" style="font-size:7pt">${schedSummary}</div>
        <br>
        <table class="print-table">
          <thead><tr>
            <th style="width:30pt">#</th><th style="text-align:left;min-width:100pt">Name</th>
            ${headerCols}
            <th>W</th><th>L</th><th>+/-</th><th>Rank</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
    }).join('')
  ).join('');

  doPrint(pages);
}

function printRuleSheet(tid) {
  const t = tid ? findTournament(tid) : null;
  const sport = t?.sport || 'Volleyball';
  const scoring = t ? (t.scoringType==='timed'
    ? `Timed games  ${t.timeLimitMinutes} minutes per game`
    : `First to ${t.pointsTarget} points${t.winBy2?' (win by 2)':''}`)
    : 'As specified per tournament';

  const html = `<div class="print-page print-rules">
    <div class="print-title">LINEAR RANKING TOURNAMENT  RULES</div>
    <div class="print-subtitle">${t ? escHtml(t.name) + '  ' : ''}${sport}</div>
    <h3>How It Works</h3>
    <p>The Linear Ranking Tournament (Bjerring system) ranks all players from best to poorest based entirely on competition results  not opinion. Each player plays <em>with</em> every other player once as a partner and <em>against</em> every other player twice as an opponent (doubles format).</p>
    <h3>Scoring</h3>
    <ul>
      <li>Each player tracks: Games Won, Games Lost, and Points Differential (+/-)</li>
      <li>Final ranking: Sort by <strong>Wins (most first)</strong>, then <strong>Points Differential</strong> to break ties</li>
      <li>Game scoring: <strong>${scoring}</strong></li>
    </ul>
    <h3>Game Rules (${sport})</h3>
    <ul>
      <li>Any player listed as <strong>OUT</strong> for a round officiates and supplies balls</li>
      <li>Servers and serve receivers must rotate between games</li>
      <li>Either player may attack; all standard skills apply</li>
      <li>You may win by 1 point unless "Win by 2" is specified</li>
      <li>Play begins when the schedule signals  manage your own time</li>
      <li>An absent player automatically drops one group in Sort &amp; Sift rounds</li>
    </ul>
    <h3>Scoresheet Instructions</h3>
    <ol>
      <li>Find your player number on the scoresheet</li>
      <li>For each round (A, B, C...) record your score as <strong>+</strong> (points scored minus points against) or <strong> (if you lost)</li>
      <li>At the end, total your Wins, Losses, and the sum of all differentials</li>
      <li>Hand the sheet to the organizer for final ranking</li>
    </ol>
    <h3>Court Dimensions (Volleyball)</h3>
    <p>Recommended: 4.5 m wide  18 m long (narrow court). Antennae optional.</p>
    <p style="margin-top:16pt;font-size:8pt;color:#777">
      LRT Designer   2026 Jared Mathes  CC BY-NC-SA 4.0 
      Based on the Bjerring Linear Ranking Tournament system
    </p>
  </div>`;
  doPrint(html);
}

function printPlayerName(group, pos) {
  const p = group.players.find(p => p.pos === pos);
  return p ? `#${pos} ${p.name}` : `#${pos}`;
}

function computePlayerStat(group, pos) {
  const standings = computeGroupStandings(group);
  return standings.find(s => s.pos === pos) || { wins: 0, losses: 0, diff: 0, rank: '' };
}

function doPrint(content) {
  const pr = document.getElementById('printRoot');
  pr.innerHTML = typeof content === 'string' ? content : content.join('');
  window.print();
}

// 
// IMPORT / EXPORT
// 
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportAllJSON() {
  downloadFile(JSON.stringify(App.data, null, 2), 'lrt-backup.json', 'application/json');
  showToast('Backup exported.', 'success');
}

function importAllJSON(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const d = JSON.parse(e.target.result);
      if (!d.tournaments || !d.athletes) throw new Error('Invalid backup format');
      App.data = { ...App.data, ...d };
      App.save();
      showToast('Backup restored successfully.', 'success');
      navigate('dashboard');
    } catch (err) {
      showToast('Invalid backup file: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

function exportTournamentJSON(tid) {
  const t = findTournament(tid);
  if (!t) return;
  downloadFile(JSON.stringify(t, null, 2), `tournament-${sanitizeFilename(t.name)}.json`, 'application/json');
  showToast('Tournament exported.', 'success');
}

function importTournamentJSON(file, tid) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const newT = JSON.parse(e.target.result);
      if (!newT.id || !newT.name) throw new Error('Invalid tournament file');
      const idx = App.data.tournaments.findIndex(t => t.id === tid);
      if (idx >= 0) App.data.tournaments[idx] = newT;
      else App.data.tournaments.push(newT);
      App.save();
      showToast('Tournament imported.', 'success');
      navigate('tournament', { tid: newT.id });
    } catch (err) {
      showToast('Invalid file: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

function exportTournamentCSV(tid) {
  const t = findTournament(tid);
  if (!t) return;
  const lines = ['Rank,Player,Wins,Losses,Points Diff'];
  t.rounds.forEach((r, ri) => r.groups.forEach((g, gi) => {
    const standings = computeGroupStandings(g);
    const prefix = t.rounds.length>1||r.groups.length>1 ? `${r.label} Group ${g.label} - ` : '';
    standings.forEach(s => lines.push(`${s.rank},"${prefix}${s.name}",${s.wins},${s.losses},${s.diff}`));
  }));
  downloadFile(lines.join('\r\n'), `standings-${sanitizeFilename(t.name)}.csv`, 'text/csv');
  showToast('CSV exported.', 'success');
}

function exportTournamentXLSX(tid) {
  if (typeof XLSX === 'undefined') { showToast('Excel library not loaded. Check internet connection.', 'error'); return; }
  const t = findTournament(tid);
  if (!t) return;
  const wb = XLSX.utils.book_new();
  t.rounds.forEach((r, ri) => r.groups.forEach((g, gi) => {
    const standings = computeGroupStandings(g);
    const sheetName = t.rounds.length>1||r.groups.length>1 ? `${r.label}-${g.label}` : 'Standings';
    const data = [['Rank','Player','Wins','Losses','Pts +/-','Games Played'],
      ...standings.map(s => [s.rank, s.name, s.wins, s.losses, s.diff, s.gamesPlayed])];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(data), sheetName.slice(0,31));
  }));
  XLSX.writeFile(wb, `tournament-${sanitizeFilename(t.name)}.xlsx`);
  showToast('XLSX exported.', 'success');
}

function exportRosterCSV() {
  const lines = ['Name,Notes,Added'];
  App.data.athletes.forEach(a =>
    lines.push(`"${a.name.replace(/"/g,'""')}","${(a.notes||'').replace(/"/g,'""')}","${formatDate(a.createdAt)}"`));
  downloadFile(lines.join('\r\n'), 'athlete-roster.csv', 'text/csv');
  showToast('Roster exported.', 'success');
}

function importRosterCSV(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const lines = e.target.result.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);
    let added = 0;
    lines.forEach((line, i) => {
      if (i === 0 && line.toLowerCase().startsWith('name')) return; // skip header
      const name = line.split(',')[0].replace(/^"|"$/g, '').trim();
      if (!name) return;
      if (!App.data.athletes.find(a => a.name.toLowerCase() === name.toLowerCase())) {
        App.data.athletes.push({ id: uuid(), name, notes: '', createdAt: Date.now() });
        added++;
      }
    });
    App.save();
    showToast(`Imported ${added} new athletes.`, 'success');
    renderView();
  };
  reader.readAsText(file);
}

function sanitizeFilename(s) {
  return s.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase().slice(0, 50);
}

// 
// EVENT HANDLERS (delegation)
// 
function handleClick(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  const id     = btn.dataset.id;

  switch (action) {
    // Navigation
    case 'new-tournament':    navigate('wizard', { wStep:1, wData:{} }); break;
    case 'go-tournaments':    navigate('tournaments'); break;
    case 'open-tournament':   navigate('tournament', { tid: id, tab:'schedule', rid:0, gid:0 }); break;
    case 'cancel-wizard':     navigate(App.state.prevView || 'tournaments'); break;
    case 'set-tab':           App.state.tab = btn.dataset.tab; renderView(); break;
    case 'set-group-tab':
      App.state.rid = parseInt(btn.dataset.rid);
      App.state.gid = parseInt(btn.dataset.gid);
      renderView(); break;

    // Wizard
    case 'wizard-next':       doWizardNext(); break;
    case 'wizard-back':       doWizardBack(); break;
    case 'wizard-create':     doWizardCreate(); break;
    case 'add-player':        doAddPlayer(); break;
    case 'remove-player': {
      const pos = parseInt(btn.dataset.pos);
      App.state.wData.players.splice(pos, 1);
      renderView(); break;
    }
    case 'add-roster-player':
      if (!App.state.wData.players) App.state.wData.players = [];
      if (!App.state.wData.athleteIds) App.state.wData.athleteIds = [];
      App.state.wData.players.push(btn.dataset.name);
      App.state.wData.athleteIds.push(btn.dataset.aid);
      renderView(); break;
    case 'select-schedule':
      App.state.wData.scheduleId = id;
      renderView(); break;
    case 'select-subset': {
      const key = btn.dataset.key;
      App.state.wData.subsetConfig = key.split(',').map(Number);
      renderView(); break;
    }

    // Score entry
    case 'save-score':        saveScore(btn.dataset.game); break;
    case 'mark-all-remaining': markAllRemaining(parseInt(btn.dataset.rid), parseInt(btn.dataset.gid)); break;

    // Tournament management
    case 'start-tournament':    doStartTournament(id); break;
    case 'complete-tournament': doCompleteTournament(id); break;
    case 'delete-tournament':   confirmDeleteTournament(id); break;
    case 'add-round':           doAddRound(id); break;

    // Roster
    case 'add-athlete':    showAthleteModal(null); break;
    case 'edit-athlete':   showAthleteModal(id); break;
    case 'delete-athlete': confirmDeleteAthlete(id); break;
    case 'export-roster':  exportRosterCSV(); break;
    case 'import-roster': {
      const fi = document.createElement('input');
      fi.type = 'file'; fi.accept = '.csv,.txt';
      fi.onchange = () => importRosterCSV(fi.files[0]);
      fi.click(); break;
    }

    // Export/Import
    case 'export-tournament-json': exportTournamentJSON(id); break;
    case 'export-tournament-xlsx': exportTournamentXLSX(id); break;
    case 'export-tournament-csv':  exportTournamentCSV(id); break;
    case 'import-tournament-file': {
      const f = document.getElementById('importTournamentFile')?.files?.[0];
      if (f) importTournamentJSON(f, App.state.tid);
      else showToast('Select a file first.', 'warning'); break;
    }
    case 'export-all-json': exportAllJSON(); break;
    case 'import-all-json': {
      const f = document.getElementById('restoreFile')?.files?.[0];
      if (f) { if (confirm('This will replace ALL data. Are you sure?')) importAllJSON(f); }
      else showToast('Select a file first.', 'warning'); break;
    }
    case 'clear-all-data':
      if (confirm('Delete ALL tournaments and roster data? This cannot be undone.')) {
        App.data.tournaments = [];
        App.data.athletes = [];
        App.save();
        showToast('All data cleared.', 'success');
        navigate('dashboard');
      } break;

    // Settings
    case 'save-settings': doSaveSettings(); break;

    // Print
    case 'print-schedule':   printSchedule(id); break;
    case 'print-scoresheet': printScoresheet(id); break;
    case 'print-rules':      printRuleSheet(id); break;

    // Modal
    case 'modal-cancel':       hideModal(); break;
    case 'save-athlete-modal': doSaveAthlete(); break;
    case 'confirm-delete-tournament': doDeleteTournament(id); break;
    case 'confirm-delete-athlete':    doDeleteAthlete(id); break;
  }
}

function handleInput(e) {
  // Live search
  if (e.target.id === 'searchInput') {
    App.state.search = e.target.value;
    renderView();
  }
  // Radio card highlight
  if (e.target.type === 'radio' && e.target.name) {
    const group = e.target.closest('.radio-group') || e.target.closest('.form-group');
    if (group) {
      group.querySelectorAll('.radio-card').forEach(c => c.classList.remove('selected'));
      e.target.closest('.radio-card')?.classList.add('selected');
    }
    // Format/Method changes require schedule re-suggestion
    if (['w-format','w-method'].includes(e.target.name)) {
      Object.assign(App.state.wData, collectStep3());
      App.state.wData.scheduleId   = null;
      App.state.wData.subsetConfig = null;
      renderView();
    }
    if (e.target.name === 'w-scoring') {
      updateWizardScoring(e.target.value);
    }
  }
}

// 
// ACTION HANDLERS
// 
function doWizardNext() {
  const step = App.state.wStep;
  if (!validateStep(step)) return;
  // Collect current step data
  if (step === 1) Object.assign(App.state.wData, collectStep1());
  if (step === 3) Object.assign(App.state.wData, collectStep3());
  if (step === 4) Object.assign(App.state.wData, collectStep4());
  App.state.wStep = step + 1;
  renderView();
}
function doWizardBack() {
  if (App.state.wStep > 1) { App.state.wStep--; renderView(); }
}
function doWizardCreate() {
  if (!validateStep(5)) return;
  Object.assign(App.state.wData, collectStep4());
  const t = createTournament(App.state.wData);
  App.data.tournaments.push(t);
  App.save();
  showToast(`"${t.name}" created!`, 'success');
  navigate('tournament', { tid: t.id, tab: 'schedule', rid: 0, gid: 0 });
}

function doStartTournament(tid) {
  const t = findTournament(tid);
  if (!t) return;
  t.status = 'active';
  App.save();
  showToast('Tournament started!', 'success');
  navigate('tournament', { tid, tab: 'scores' });
}
function doCompleteTournament(tid) {
  const t = findTournament(tid);
  if (!t) return;
  if (!confirm('Mark this tournament as completed?')) return;
  t.status = 'completed';
  t.completedAt = Date.now();
  App.save();
  showToast('Tournament completed!', 'success');
  navigate('tournament', { tid, tab: 'standings' });
}
function confirmDeleteTournament(tid) {
  const t = findTournament(tid);
  if (!t) return;
  showModal('Delete Tournament',
    `<p>Delete <strong>${escHtml(t.name)}</strong>? This cannot be undone.</p>`,
    `<button class="btn btn-ghost" data-action="modal-cancel">Cancel</button>
     <button class="btn btn-danger" data-action="confirm-delete-tournament" data-id="${tid}">Delete</button>`);
}
function doDeleteTournament(tid) {
  App.data.tournaments = App.data.tournaments.filter(t => t.id !== tid);
  App.save(); hideModal(); showToast('Tournament deleted.', 'success');
  navigate('tournaments');
}
function doAddRound(tid) {
  const t = findTournament(tid);
  if (!t || t.method !== 'sortSift') return;
  const newRound = {
    id: uuid(), roundNumber: t.rounds.length + 1,
    label: `Round ${t.rounds.length + 1}`, groups: []
  };
  // Auto-suggest new groups from last round standings
  const lastRound = t.rounds[t.rounds.length - 1];
  const allStandings = lastRound.groups.flatMap(g => computeGroupStandings(g).map(s => ({ ...s, groupLabel: g.label })));
  allStandings.sort((a,b) => a.rank - b.rank || a.pos - b.pos);
  const fmt = t.format;
  const courts = t.courts || 1;
  const n = allStandings.length;
  const opts = findSubsetOptions(n, courts, fmt);
  if (!opts.length) { showToast('Cannot auto-create next round groups.', 'warning'); return; }
  const split = opts[0];
  let playerIdx = 0;
  split.forEach((sz, gi) => {
    const players = allStandings.slice(playerIdx, playerIdx + sz);
    playerIdx += sz;
    const sched = SCHEDULE_LIST.find(s => s.type===fmt && s.size===sz && s.courts===1);
    if (!sched) return;
    newRound.groups.push(buildGroup(players.map(s => ({ name: s.name, athleteId: s.athleteId })), sched, gi));
  });
  t.rounds.push(newRound);
  t.status = 'active';
  App.save();
  showToast('New round added!', 'success');
  navigate('tournament', { tid, tab: 'scores', rid: t.rounds.length - 1, gid: 0 });
}

function saveScore(gameId) {
  const t = findTournament(App.state.tid);
  if (!t) return;
  let game = null;
  outer: for (const r of t.rounds) for (const g of r.groups) {
    const found = g.games.find(gm => gm.id === gameId);
    if (found) { game = found; break outer; }
  }
  if (!game) return;
  const s1 = parseInt(document.querySelector(`input[data-game="${gameId}"][data-side="1"]`)?.value);
  const s2 = parseInt(document.querySelector(`input[data-game="${gameId}"][data-side="2"]`)?.value);
  if (isNaN(s1) || isNaN(s2)) { showToast('Enter valid scores.', 'error'); return; }
  game.score1 = s1; game.score2 = s2; game.completed = true;
  if (t.status === 'setup') t.status = 'active';
  App.save(); renderView();
}

function markAllRemaining(rid, gid) {
  const t = findTournament(App.state.tid);
  if (!t) return;
  const group = getGroup(t, rid, gid);
  if (!group) return;
  group.games.filter(g => !g.completed).forEach(g => {
    g.score1 = 0; g.score2 = 0; g.completed = true;
  });
  App.save(); renderView();
  showToast('All games marked complete.', 'info');
}

function showAthleteModal(id) {
  const a = id ? findAthlete(id) : null;
  showModal(a ? 'Edit Athlete' : 'Add Athlete',
    `<div class="form-group">
      <label class="form-label" for="ath-name">Name <span style="color:red">*</span></label>
      <input class="form-input" id="ath-name" type="text" maxlength="80" value="${escHtml(a?.name||'')}" autofocus>
     </div>
     <div class="form-group">
      <label class="form-label" for="ath-notes">Notes</label>
      <input class="form-input" id="ath-notes" type="text" maxlength="200" value="${escHtml(a?.notes||'')}">
     </div>
     <input type="hidden" id="ath-id" value="${id||''}">`,
    `<button class="btn btn-ghost" data-action="modal-cancel">Cancel</button>
     <button class="btn btn-primary" data-action="save-athlete-modal">Save</button>`);
}
function doSaveAthlete() {
  const id    = document.getElementById('ath-id')?.value;
  const name  = document.getElementById('ath-name')?.value?.trim();
  const notes = document.getElementById('ath-notes')?.value?.trim() || '';
  if (!name) { showToast('Name is required.', 'error'); return; }
  if (id) {
    const a = findAthlete(id);
    if (a) { a.name = name; a.notes = notes; }
  } else {
    App.data.athletes.push({ id: uuid(), name, notes, createdAt: Date.now() });
  }
  App.save(); hideModal(); showToast('Athlete saved.', 'success'); renderView();
}
function confirmDeleteAthlete(id) {
  const a = findAthlete(id);
  if (!a) return;
  showModal('Delete Athlete',
    `<p>Remove <strong>${escHtml(a.name)}</strong> from the roster?</p>`,
    `<button class="btn btn-ghost" data-action="modal-cancel">Cancel</button>
     <button class="btn btn-danger" data-action="confirm-delete-athlete" data-id="${id}">Delete</button>`);
}
function doDeleteAthlete(id) {
  App.data.athletes = App.data.athletes.filter(a => a.id !== id);
  App.save(); hideModal(); showToast('Athlete removed.', 'success'); renderView();
}

function doSaveSettings() {
  App.data.settings = {
    defaultSport:            document.getElementById('s-sport')?.value?.trim() || '',
    defaultScoringType:      document.getElementById('s-scoring')?.value || 'points',
    defaultPointsTarget:     parseInt(document.getElementById('s-points')?.value) || 15,
    defaultTimeLimitMinutes: parseInt(document.getElementById('s-time')?.value) || 7,
    defaultWinBy2:           document.getElementById('s-winby2')?.checked || false
  };
  App.save();
  showToast('Settings saved.', 'success');
}

// 
// INIT
// 
async function init() {
  await App.load();

  // Navigation buttons
  document.querySelectorAll('[data-nav]').forEach(btn =>
    btn.addEventListener('click', e => {
      e.preventDefault();
      navigate(btn.dataset.nav);
    })
  );

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = mobileNav.hasAttribute('hidden');
      mobileNav.toggleAttribute('hidden', !open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
  }

  // Modal close
  document.getElementById('modalClose')?.addEventListener('click', hideModal);
  document.getElementById('modalBackdrop')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) hideModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hideModal(); });

  // Event delegation
  document.addEventListener('click', handleClick);
  document.addEventListener('input', handleInput);
  document.addEventListener('change', handleInput);

  navigate('dashboard');
}

document.addEventListener('DOMContentLoaded', init);
