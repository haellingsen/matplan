"use strict";

/* In-memory store – populated by loadFood() on page init */
let food = {};

/* ─── API ─── */
async function loadFood() {
  const res = await fetch('/api/food');
  if (!res.ok) throw new Error('Kunne ikke laste retter fra server.');
  food = await res.json();
}

async function saveFood() {
  const res = await fetch('/api/food', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(food),
  });
  if (!res.ok) throw new Error('Kunne ikke lagre retter på server.');
}

/* ─── READ ─── */
function getAllFood()        { return food; }
function isBuiltin(name)    { return Object.prototype.hasOwnProperty.call(_builtin, name); }

function getAllIngredients() {
  const all = new Set();
  Object.values(food).forEach(d => d.ingredienser.forEach(i => all.add(i)));
  return [...all].sort((a, b) => a.localeCompare(b, 'no'));
}

function pickMeal(required = []) {
  const keys = Object.keys(food);
  const pool = required.length
    ? keys.filter(k => required.every(i => food[k].ingredienser.includes(i)))
    : keys;
  if (!pool.length) return null;
  const name = pool[Math.floor(Math.random() * pool.length)];
  return { name, ...food[name] };
}

/* ─── WRITE ─── */
async function addDish(name, ingredienser, koketid) {
  const key = name.trim().toLowerCase();
  if (!key)                return { ok: false, error: 'Navn er påkrevd.' };
  if (!ingredienser.length) return { ok: false, error: 'Minst én ingrediens er påkrevd.' };
  if (food[key])           return { ok: false, error: `"${key}" finnes allerede.` };
  food[key] = { ingredienser, koketid: [Math.max(1, Number(koketid) || 1)] };
  await saveFood();
  return { ok: true, name: key };
}

async function removeDish(name) {
  if (!food[name]) return false;
  delete food[name];
  await saveFood();
  return true;
}

async function importFromJSON(jsonString) {
  let parsed;
  try { parsed = JSON.parse(jsonString); }
  catch { return { ok: false, error: 'Ugyldig JSON.' }; }

  if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null)
    return { ok: false, error: 'JSON må være et objekt: { "rettnavn": { "ingredienser": [...], "koketid": [N] } }' };

  const added = [], skipped = [];
  for (const [name, data] of Object.entries(parsed)) {
    const key = name.trim().toLowerCase();
    if (!key) continue;
    if (food[key]) { skipped.push(key); continue; }
    if (!Array.isArray(data?.ingredienser) || !data.ingredienser.length) { skipped.push(key); continue; }
    const kt = Array.isArray(data.koketid) ? data.koketid[0] : (data.koketid ?? 1);
    food[key] = {
      ingredienser: data.ingredienser.map(s => String(s).trim()).filter(Boolean),
      koketid: [Math.max(1, Number(kt) || 1)],
    };
    added.push(key);
  }
  if (added.length) await saveFood();
  return { ok: true, added, skipped };
}

/* Which names were in the original file — used for the "innebygd" badge.
   Populated lazily on first isBuiltin() call after loadFood(). */
let _builtin = null;
const _origIsBuiltin = isBuiltin;
// We detect built-ins as whatever was in food at the time the page first loaded.
// Set after loadFood() in index.html init().
function markBuiltins() { _builtin = { ...food }; }
