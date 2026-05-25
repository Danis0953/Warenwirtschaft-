# Warenwirtschaftssystem

Ein professionelles Warenwirtschaftssystem mit Wareneingang, Warenausgang und Datenspeicherung.

## Features

✅ **Wareneingang & Warenausgang** - Mit Datum und Seriennummerverfolgung
✅ **Artikel-Management** - Vordefinierte Artikel + eigene hinzufügbar
✅ **Datenspeicherung** - Alle Daten werden in SQLite-Datenbank gespeichert
✅ **Export** - JSON-Export der gesamten Daten
✅ **Bestandsverwaltung** - Automatische Berechnung des Bestands
✅ **Farbcodierung** - Nach Firmen gekennzeichnet

## Farbcodierung

- 🔴 **Rot** = Hale
- 🔵 **Blau** = Semitron
- 🟡 **Gelb** = Mercedes
- 🟢 **Grün** = FMS

## Installation

### Voraussetzungen
- Node.js (v14+)
- npm

### Setup

```bash
# Abhängigkeiten installieren
npm install

# Server starten
npm start
```

Der Server läuft dann auf `http://localhost:3000`

## Nutzung

1. **Wareneingang erfassen**: Tab "Wareneingang" → Artikel wählen → Menge/Datum eingeben → Speichern
2. **Warenausgang erfassen**: Tab "Warenausgang" → Artikel wählen → Menge/Datum eingeben → Speichern
3. **Artikel hinzufügen**: Tab "Artikel" → Neuen Artikel eingeben → Hinzufügen
4. **Daten exportieren**: Export-Button → JSON-Datei herunterladen

## Vordefinierte Artikel

### Hale (Rot)
- Taxameter
- Wegstreckenzähler
- Sei 03 Box

### Semitron (Blau)
- Taxameter
- Dachzeichenartikel

### Mercedes (Gelb)
- Steuergeräte
- Taxi Dachzeichen

### FMS (Grün)
- Austrosoft SmartHubX2
- Samsung Xcover 7

## API Endpunkte

- `GET /api/artikel` - Alle Artikel abrufen
- `POST /api/artikel` - Neuen Artikel erstellen
- `GET /api/wareneingang` - Alle Wareneingänge abrufen
- `POST /api/wareneingang` - Wareneingang erfassen
- `GET /api/warenausgang` - Alle Warenausgänge abrufen
- `POST /api/warenausgang` - Warenausgang erfassen
- `GET /api/export` - Alle Daten als JSON exportieren

## Lizenz

MIT
