# Padelhouse Hallertau – Web-App Deployment

Diese Anleitung bringt die App von Claude Artifacts auf eine echte, für alle
Kunden ohne Konto nutzbare Webseite (kostenlos über Vercel + Supabase).

## Voraussetzung
- GitHub-Account
- Vercel-Account (mit GitHub verbunden)
- Supabase-Account mit angelegtem Projekt

## Schritt 1: Supabase-Datenbank einrichten
1. Supabase-Projekt öffnen
2. Links im Menü auf **SQL Editor** klicken
3. **New query**
4. Inhalt von `supabase-setup.sql` (in diesem Ordner) hineinkopieren
5. **Run** klicken – die Tabelle `app_storage` wird angelegt

## Schritt 2: Supabase-Zugangsdaten (bereits erledigt)
Die Zugangsdaten sind bereits fest in `src/supabaseClient.js` eingetragen.
Du musst hier nichts weiter tun.

## Schritt 3: Code auf GitHub hochladen
1. Auf github.com: **New repository** → Name z. B. `padelhouse-hallertau`
   → **Private** oder **Public**, beides geht → **Create repository**
2. Alle Dateien aus diesem Ordner (`padelhouse-web`) in das neue Repository hochladen:
   - Einfachster Weg ohne Kommandozeile: Auf der GitHub-Repo-Seite auf
     **„uploading an existing file"** klicken, alle Dateien/Ordner reinziehen,
     **Commit changes**
   - Wichtig: Die Ordnerstruktur muss erhalten bleiben (`src/`-Ordner mit den
     Dateien darin, nicht alles in einen Topf)

## Schritt 4: Bei Vercel verbinden
1. Auf vercel.com: **Add New → Project**
2. Das gerade hochgeladene GitHub-Repository auswählen → **Import**
3. **Deploy** klicken – dauert ca. 1–2 Minuten (Umgebungsvariablen müsst ihr
   nicht setzen, die Zugangsdaten stecken schon im Code)
4. Fertig! Vercel zeigt dir danach eine echte URL, z. B.
   `padelhouse-hallertau.vercel.app`

## Änderungen später
Wenn ich dir künftig Code-Änderungen gebe:
1. Ich schicke dir die aktualisierte `App.jsx`
2. Du lädst sie im GitHub-Repository hoch (ersetzt die alte Datei in `src/`)
3. Vercel erkennt die Änderung automatisch und aktualisiert die Seite selbst
   – kein erneuter manueller Schritt bei Vercel nötig

## Eigene Domain (optional, später)
Falls ihr später eine eigene Adresse wie `app.padelhouse-hallertau.de`
wollt, lässt sich das in den Vercel-Projekteinstellungen unter **Domains**
hinzufügen (kostenlos bei Vercel, ihr braucht nur eine eigene Domain, die ihr
z. B. bei einem Domain-Anbieter kauft).
