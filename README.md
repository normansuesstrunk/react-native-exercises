# React (Native) Übungen: Props & State

Übungssammlung zum Einstieg in **Props** und **State**, aufbauend auf dem offiziellen
Beispiel [Handling Text Input](https://reactnative.dev/docs/handling-text-input)
(`TextInput`, `onChangeText`, `onSubmitEditing`, "PizzaTranslator").

## Lernziele

Nach den Übungen können Studierende:

1. Daten über **Props** von einer Eltern- an eine Kindkomponente übergeben und Props als *read-only* begründen.
2. Veränderliche Daten mit **`useState`** verwalten und den Unterschied zu Props erklären.
3. **Kontrollierte Eingabefelder** (`value` + `onChangeText`) bauen.
4. State **nach oben ziehen** (*lifting state up*) und über **Callback-Props** von Kind zu Eltern kommunizieren.
5. Zusammengesetzten State (Objekte, Listen) **unveränderlich** aktualisieren.
6. **Abgeleitete Werte** berechnen, statt sie redundant im State zu halten.

## Aufbau

| Stufe | Datei | Thema | Zeit ca. |
|---|---|---|---|
| 1 | [uebungen/stufe-1-props.md](uebungen/stufe-1-props.md) | Props: lesen, weitergeben, Defaults | 30 min |
| 2 | [uebungen/stufe-2-state.md](uebungen/stufe-2-state.md) | `useState` + `TextInput`, kontrollierte Felder | 45 min |
| 3 | [uebungen/stufe-3-props-und-state.md](uebungen/stufe-3-props-und-state.md) | Wiederverwendbare Komponenten, Lifting State Up | 60 min |
| 4 | [uebungen/stufe-4-formular-und-liste.md](uebungen/stufe-4-formular-und-liste.md) | Objekt-State, Listen, `onSubmitEditing` | 75 min |
| 5 | [uebungen/stufe-5-bonus.md](uebungen/stufe-5-bonus.md) | Filter, Debounce, `useReducer`, Custom Hook, `memo` | offen |

Lösungen liegen in [loesungen/](loesungen/) — **erst nach eigenem Versuch öffnen**.

## Setup

**Variante A (ohne Installation, empfohlen für die Übung):**
[snack.expo.dev](https://snack.expo.dev) öffnen und den jeweiligen Code in `App.js` einfügen.

**Variante B (lokal):**

```bash
npx create-expo-app@latest rn-uebungen --template blank-typescript
cd rn-uebungen
npx expo start
```

Jeder Codeblock in den Aufgaben ist eine **vollständige `App.js`** — einfach ersetzen und speichern.

> **Nur React für Web?** Alle Aufgaben lassen sich 1:1 übertragen:
> `View` → `div`, `Text` → `span`/`p`, `TextInput` → `input`,
> `onChangeText={t => ...}` → `onChange={e => ... e.target.value ...}`,
> `FlatList` → `array.map(...)`. Die Konzepte (Props, State) sind identisch.

## Arbeitsweise

Für jede Aufgabe gilt:

1. **Akzeptanzkriterien** lesen — sie definieren, wann die Aufgabe fertig ist.
2. Erst selbst versuchen, dann die **Hinweise** aufklappen.
3. Die **Reflexionsfragen** beantworten (mündlich oder als Kommentar im Code).

## Bewertungsraster (optional)

| Kriterium | Punkte |
|---|---|
| Funktion erfüllt alle Akzeptanzkriterien | 40 |
| Props korrekt eingesetzt (keine Mutation, sinnvolle Schnittstelle) | 20 |
| State minimal & unveränderlich aktualisiert (kein redundanter State) | 20 |
| Komponentenaufteilung & Wiederverwendbarkeit | 10 |
| Lesbarkeit (Namen, Struktur, keine toten Codeteile) | 10 |
