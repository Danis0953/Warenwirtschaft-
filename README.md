# 📦 Warenwirtschaftssystem

Eine vollständige Webapp zur Verwaltung von Wareneingang und Warenausgang mit Seriennummernverfolgung.

## 🎯 Features

✅ **Wareneingang & Warenausgang** - Erfassen mit Datum und Seriennummern
✅ **Artikel-Management** - Vordefinierte Artikel aller 4 Firmen + Eigenartikel hinzufügbar
✅ **Datenbank** - SQLite für persistente Datenspeicherung
✅ **Farbcodierung** - Visuelles Firma-System
✅ **Übersicht & Statistiken** - Bestand nach Firma, Seriennummern-Tracking
✅ **Suchfunktion** - Schnelle Filterung
✅ **Export** - JSON-Export aller Daten
✅ **Responsive Design** - Funktioniert auf allen Geräten

## 🎨 Farbcodierung

- 🔴 **Rot** = Hale
- 🔵 **Blau** = Semitron
- 🟢 **Grün** = FMS
- 🟡 **Gelb** = Mercedes

## 📦 Vordefinierte Artikel

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

## 🚀 Installation

### Voraussetzungen
- Node.js >= 14.0
- npm oder yarn

### Setup

```bash
# 1. Repository klonen
git clone https://github.com/Danis0953/Warenwirtschaft-.git
cd Warenwirtschaft-

# 2. Abhängigkeiten installieren
npm install

# 3. Server starten
npm start
```

Die Anwendung läuft dann auf **http://localhost:3000**

## 💻 Verwendung

### Wareneingang
1. Gehe zum Tab "Wareneingang"
2. Wähle einen Artikel
3. Gebe die Menge ein
4. Wähle das Datum
5. Optional: Gebe eine Seriennummer ein
6. Klicke "Wareneingang erfassen"

### Warenausgang
- Gleicher Prozess wie Wareneingang über den Tab "Warenausgang"

### Artikel hinzufügen
1. Gehe zum Tab "Artikel"
2. Gebe einen Namen ein
3. Wähle die Firma
4. Klicke "Artikel hinzufügen"

### Daten exportieren
1. Gehe zum Tab "Übersicht"
2. Klicke "Daten exportieren (JSON)"
3. Die Datei wird heruntergeladen

## 📊 Tabs

### 📥 Wareneingang
- Erfassung von Wareneingängen
- Übersicht aller Eingänge
- Suchfunktion

### 📤 Warenausgang
- Erfassung von Warenausgängen
- Übersicht aller Ausgänge
- Suchfunktion

### 📋 Artikel
- Verwaltung aller Artikel
- Hinzufügen neuer Artikel
- Aktuelle Bestände
- Filter nach Firma

### 📊 Übersicht
- Statistiken und Kennzahlen
- Bestand nach Firma
- Seriennummern-Tracking
- Export-Funktion

## 🛠️ Technologie

- **Backend:** Node.js + Express.js
- **Frontend:** HTML5 + CSS3 + JavaScript (Vanilla)
- **Datenbank:** SQLite3
- **API:** RESTful

## 📝 API Endpoints

### Artikel
- `GET /api/artikel` - Alle Artikel
- `POST /api/artikel` - Neuen Artikel hinzufügen
- `DELETE /api/artikel/:id` - Artikel löschen

### Wareneingang
- `GET /api/wareneingang` - Alle Eingänge
- `POST /api/wareneingang` - Neue Erfassung
- `DELETE /api/wareneingang/:id` - Eintrag löschen

### Warenausgang
- `GET /api/warenausgang` - Alle Ausgänge
- `POST /api/warenausgang` - Neue Erfassung
- `DELETE /api/warenausgang/:id` - Eintrag löschen

### Statistiken
- `GET /api/stats` - Statistiken abrufen

## 💾 Datenspeicherung

Alle Daten werden in einer SQLite-Datenbank (`warenwirtschaft.db`) gespeichert. Diese wird automatisch beim ersten Start erstellt.

## 📤 Export

Die JSON-Datei enthält:
- Alle Artikel
- Alle Wareneingänge
- Alle Warenausgänge
- Statistiken
- Exportzeitpunkt

## 🐛 Bekannte Probleme

Keine bekannten Probleme.

## 📄 Lizenz

MIT

## 👤 Autor

Danis0953

## 🤝 Support

Bei Fragen oder Problemen bitte ein Issue erstellen.
