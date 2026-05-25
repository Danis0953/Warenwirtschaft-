const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Datenbank Setup
const db = new sqlite3.Database(path.join(__dirname, 'warenwirtschaft.db'), (err) => {
  if (err) {
    console.error('Fehler beim Öffnen der Datenbank:', err);
  } else {
    console.log('✓ Datenbank verbunden');
    initDatabase();
  }
});

// Datenbank initialisieren
function initDatabase() {
  db.serialize(() => {
    // Artikel Tabelle
    db.run(`
      CREATE TABLE IF NOT EXISTS artikel (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        firma TEXT NOT NULL,
        nummer TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Wareneingang Tabelle
    db.run(`
      CREATE TABLE IF NOT EXISTS wareneingang (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        artikel_id INTEGER NOT NULL,
        artikel_name TEXT NOT NULL,
        menge INTEGER NOT NULL,
        datum DATE NOT NULL,
        seriennummer TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (artikel_id) REFERENCES artikel(id)
      )
    `);

    // Warenausgang Tabelle
    db.run(`
      CREATE TABLE IF NOT EXISTS warenausgang (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        artikel_id INTEGER NOT NULL,
        artikel_name TEXT NOT NULL,
        menge INTEGER NOT NULL,
        datum DATE NOT NULL,
        seriennummer TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (artikel_id) REFERENCES artikel(id)
      )
    `);

    // Standardartikel einfügen (nur wenn noch nicht vorhanden)
    db.get(`SELECT COUNT(*) as count FROM artikel`, (err, row) => {
      if (row && row.count === 0) {
        const standardArtikel = [
          // Hale (Rot)
          { name: 'Taxameter', firma: 'Hale', nummer: 'HAL-TAX-001' },
          { name: 'Wegstreckenzähler', firma: 'Hale', nummer: 'HAL-WEG-001' },
          { name: 'Sei 03 Box', firma: 'Hale', nummer: 'HAL-SEI-001' },
          // Semitron (Blau)
          { name: 'Taxameter', firma: 'Semitron', nummer: 'SEM-TAX-001' },
          { name: 'Dachzeichenartikel', firma: 'Semitron', nummer: 'SEM-DAC-001' },
          // Mercedes (Gelb)
          { name: 'Steuergeräte', firma: 'Mercedes', nummer: 'MER-STR-001' },
          { name: 'Taxi Dachzeichen', firma: 'Mercedes', nummer: 'MER-DAC-001' },
          // FMS (Grün)
          { name: 'Austrosoft SmartHubX2', firma: 'FMS', nummer: 'FMS-HUB-001' },
          { name: 'Samsung Xcover 7', firma: 'FMS', nummer: 'FMS-SAM-001' }
        ];

        const stmt = db.prepare(`INSERT INTO artikel (name, firma, nummer) VALUES (?, ?, ?)`);
        standardArtikel.forEach(art => {
          stmt.run(art.name, art.firma, art.nummer);
        });
        stmt.finalize();
        console.log('✓ Standardartikel eingefügt');
      }
    });
  });
}

// ============ API ENDPOINTS ============

// GET - Alle Artikel
app.get('/api/artikel', (req, res) => {
  db.all(`SELECT * FROM artikel ORDER BY firma, name`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// POST - Neuen Artikel hinzufügen
app.post('/api/artikel', (req, res) => {
  const { name, firma, nummer } = req.body;
  
  if (!name || !firma) {
    res.status(400).json({ error: 'Name und Firma sind erforderlich' });
    return;
  }

  db.run(
    `INSERT INTO artikel (name, firma, nummer) VALUES (?, ?, ?)`,
    [name, firma, nummer || `${firma}-${Date.now()}`],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, name, firma, nummer });
    }
  );
});

// DELETE - Artikel löschen
app.delete('/api/artikel/:id', (req, res) => {
  const id = req.params.id;
  
  db.run(`DELETE FROM artikel WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, id });
  });
});

// GET - Wareneingang
app.get('/api/wareneingang', (req, res) => {
  db.all(
    `SELECT * FROM wareneingang ORDER BY datum DESC, created_at DESC`,
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// POST - Wareneingang hinzufügen
app.post('/api/wareneingang', (req, res) => {
  const { artikel_name, menge, datum, seriennummer } = req.body;
  
  if (!artikel_name || !menge || !datum) {
    res.status(400).json({ error: 'Artikel, Menge und Datum sind erforderlich' });
    return;
  }

  // Artikel ID suchen
  db.get(`SELECT id FROM artikel WHERE name = ?`, [artikel_name], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const artikel_id = row ? row.id : null;

    db.run(
      `INSERT INTO wareneingang (artikel_id, artikel_name, menge, datum, seriennummer) VALUES (?, ?, ?, ?, ?)`,
      [artikel_id, artikel_name, menge, datum, seriennummer || null],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ id: this.lastID, artikel_name, menge, datum, seriennummer });
      }
    );
  });
});

// DELETE - Wareneingang löschen
app.delete('/api/wareneingang/:id', (req, res) => {
  const id = req.params.id;
  
  db.run(`DELETE FROM wareneingang WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, id });
  });
});

// GET - Warenausgang
app.get('/api/warenausgang', (req, res) => {
  db.all(
    `SELECT * FROM warenausgang ORDER BY datum DESC, created_at DESC`,
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// POST - Warenausgang hinzufügen
app.post('/api/warenausgang', (req, res) => {
  const { artikel_name, menge, datum, seriennummer } = req.body;
  
  if (!artikel_name || !menge || !datum) {
    res.status(400).json({ error: 'Artikel, Menge und Datum sind erforderlich' });
    return;
  }

  // Artikel ID suchen
  db.get(`SELECT id FROM artikel WHERE name = ?`, [artikel_name], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const artikel_id = row ? row.id : null;

    db.run(
      `INSERT INTO warenausgang (artikel_id, artikel_name, menge, datum, seriennummer) VALUES (?, ?, ?, ?, ?)`,
      [artikel_id, artikel_name, menge, datum, seriennummer || null],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ id: this.lastID, artikel_name, menge, datum, seriennummer });
      }
    );
  });
});

// DELETE - Warenausgang löschen
app.delete('/api/warenausgang/:id', (req, res) => {
  const id = req.params.id;
  
  db.run(`DELETE FROM warenausgang WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, id });
  });
});

// GET - Statistiken
app.get('/api/stats', (req, res) => {
  db.all(`SELECT * FROM artikel`, (err, artikel) => {
    db.all(`SELECT * FROM wareneingang`, (err1, eingang) => {
      db.all(`SELECT * FROM warenausgang`, (err2, ausgang) => {
        if (err || err1 || err2) {
          res.status(500).json({ error: 'Fehler beim Abrufen der Statistiken' });
          return;
        }
        res.json({
          artikel: artikel ? artikel.length : 0,
          eingang: eingang ? eingang.length : 0,
          ausgang: ausgang ? ausgang.length : 0
        });
      });
    });
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`\n🚀 Warenwirtschaftssystem läuft auf http://localhost:${PORT}`);
  console.log('📊 Öffne die Anwendung im Browser\n');
});

// Datenbank schließen bei Beendigung
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Fehler beim Schließen der Datenbank:', err);
    } else {
      console.log('\n✓ Datenbank geschlossen');
    }
    process.exit(0);
  });
});
