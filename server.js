"use strict";
const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const DATA = path.join(__dirname, 'food.json');
const PORT = process.env.PORT || 3000;

app.use(express.json());

/* GET all dishes */
app.get('/api/food', (_req, res) => {
  try {
    res.json(JSON.parse(fs.readFileSync(DATA, 'utf8')));
  } catch (e) {
    res.status(500).json({ error: 'Kunne ikke lese food.json' });
  }
});

/* POST – replace entire food store */
app.post('/api/food', (req, res) => {
  if (typeof req.body !== 'object' || Array.isArray(req.body) || req.body === null)
    return res.status(400).json({ error: 'Forventet et JSON-objekt' });
  try {
    fs.writeFileSync(DATA, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Kunne ikke skrive food.json' });
  }
});

/* Serve static files after API routes */
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () =>
  console.log(`\n  Matplan → http://localhost:${PORT}\n`)
);
