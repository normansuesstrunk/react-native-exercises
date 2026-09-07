# Stufe 5 — Bonus / Vertiefung

**Lernziele:** abgeleiteter State & `useMemo` · Seiteneffekte mit `useEffect` + Cleanup (Debounce) · `useReducer` · eigene Hooks · Re-Render-Kosten (`memo`, `useCallback`).

**Voraussetzung:** [Stufe 4](stufe-4-formular-und-liste.md).

---

## Aufgabe 5.1 — Live-Suchfilter

**Akzeptanzkriterien**

- [ ] Über der Liste aus Stufe 4 gibt es ein Suchfeld.
- [ ] Die Liste zeigt nur Einträge, deren Text die Suche enthält (Groß-/Kleinschreibung egal).
- [ ] Die **gefilterte Liste ist kein State** — sie wird beim Rendern berechnet.
- [ ] Angezeigt wird `3 von 12 Einträgen`.
- [ ] Bei leerem Filterergebnis erscheint `Keine Treffer für "<suche>".`
- [ ] Optional: Die Berechnung ist mit `useMemo` auf `[items, query]` gemerkt — begründe, ob das hier überhaupt nötig ist.

<details><summary>Hinweis</summary>

```jsx
const visible = useMemo(
  () => items.filter(i => i.text.toLowerCase().includes(query.trim().toLowerCase())),
  [items, query],
);
```

Ehrliche Antwort zur Begründung: Bei 12 Einträgen bringt `useMemo` **nichts** —
es ist hier eine Übung, kein notwendiger Optimierungsschritt. Voreilige Memoisierung
kostet Lesbarkeit. Miss erst, optimiere dann.
</details>

---

## Aufgabe 5.2 — Debounce mit `useEffect`

Die Suche soll erst 400 ms nach der letzten Tasteneingabe "greifen" (z. B. für eine teure Abfrage).

**Akzeptanzkriterien**

- [ ] Zwei States: `query` (sofort, am Feld) und `debouncedQuery` (verzögert, für den Filter).
- [ ] `useEffect` mit `setTimeout` setzt `debouncedQuery`; die **Cleanup-Funktion** räumt den Timer ab.
- [ ] Schnelles Tippen löst genau **einen** finalen Update aus, nicht einen pro Zeichen (mit `console.log` nachweisen).
- [ ] Das Eingabefeld bleibt trotzdem sofort responsiv.
- [ ] Du kannst erklären, was ohne `clearTimeout` passieren würde.

<details><summary>Hinweis</summary>

```jsx
useEffect(() => {
  const id = setTimeout(() => setDebouncedQuery(query), 400);
  return () => clearTimeout(id); // ← läuft vor dem nächsten Effekt & beim Unmount
}, [query]);
```
</details>

---

## Aufgabe 5.3 — Formular auf `useReducer` umstellen

**Akzeptanzkriterien**

- [ ] Das Formular aus 4.1 nutzt `useReducer` statt `useState`.
- [ ] Actions mindestens: `{type: 'change', field, value}`, `{type: 'reset'}`, `{type: 'submit'}`.
- [ ] Der Reducer ist eine **reine Funktion** außerhalb der Komponente und mutiert `state` nicht.
- [ ] Verhalten der App ist unverändert.
- [ ] Notiere in 2–3 Sätzen, wann `useReducer` gegenüber `useState` die bessere Wahl ist.

---

## Aufgabe 5.4 — Eigener Hook `useTextField`

**Akzeptanzkriterien**

- [ ] `useTextField(initial, {validate})` liefert `{value, onChangeText, onBlur, error, touched, reset}` zurück.
- [ ] Zwei Felder im Formular nutzen den Hook; die Komponente wird dadurch kürzer.
- [ ] Das Ergebnis lässt sich direkt an `LabeledInput` spreaden: `<LabeledInput label="E-Mail" {...email} />`.
- [ ] Die Regeln für Hooks werden eingehalten (Aufruf nur auf oberster Ebene, Name beginnt mit `use`).

---

## Aufgabe 5.5 — Re-Renders sichtbar machen

**Akzeptanzkriterien**

- [ ] Baue in `ListItem` ein `console.log('render', item.text)` ein und beobachte: Beim Tippen ins Suchfeld rendern **alle** Zeilen neu.
- [ ] Wickle `ListItem` in `React.memo` und übergib `onToggle`/`onDelete` über `useCallback` — jetzt rendern nur betroffene Zeilen.
- [ ] Erkläre, warum `memo` **ohne** `useCallback` wirkungslos bleibt.
- [ ] Bewerte ehrlich: Lohnt sich das bei 12 Einträgen? Ab wann schon?

<details><summary>Hinweis</summary>

Bei jedem Render von `App` entsteht eine **neue Funktionsreferenz** für `onToggle`.
`React.memo` vergleicht Props flach (`===`) — eine neue Funktion ist nie gleich der alten,
also rendert das Kind trotzdem. `useCallback(fn, [])` hält die Referenz stabil.
</details>

---

## Aufgabe 5.6 — Freie Aufgabe: Mini-App

Baue eine kleine App, die alle Konzepte kombiniert. Vorschläge:

- **Vokabeltrainer:** Wortpaare anlegen, abfragen, Trefferquote anzeigen.
- **Umfrage:** Fragen als Props konfiguriert, Antworten im State, Auswertung am Ende.
- **Einkaufsliste:** Menge + Artikel, Filter "offen/erledigt", Summe.

**Anforderungen:** mindestens 3 eigene Komponenten · mindestens eine Callback-Prop · kein redundanter State ·
alle State-Updates unveränderlich · eine kurze Begründung (README), wo welcher State lebt.

---

## Reflexionsfragen

1. Nenne drei Situationen, in denen ein zusätzlicher State **falsch** wäre.
2. Was macht die Cleanup-Funktion in `useEffect`, und wann läuft sie?
3. `useState` vs. `useReducer` — wo verläuft für dich die Grenze?
4. Warum ist "erst messen, dann optimieren" bei `memo`/`useMemo`/`useCallback` besonders wichtig?

Lösung: [loesungen/stufe-5.md](../loesungen/stufe-5.md)
