# Stufe 4 — Formular mit Objekt-State und Liste

**Lernziele:** zusammengesetzten State unveränderlich aktualisieren · Listen rendern · `onSubmitEditing` · Callback-Props zum Löschen · Keys.

**Voraussetzung:** [Stufe 3](stufe-3-props-und-state.md).

---

## Aufgabe 4.1 — Ein State-Objekt statt vieler States

Ein Formular mit vier Feldern: Vorname, Nachname, E-Mail, Notiz (mehrzeilig).

**Akzeptanzkriterien**

- [ ] Alle Werte liegen in **einem** State: `const [form, setForm] = useState({firstName: '', lastName: '', email: '', note: ''})`.
- [ ] Es gibt **eine** generische Änderungsfunktion `updateField(field, value)`, die alle vier Felder bedient.
- [ ] Der State wird **unveränderlich** aktualisiert (Spread), nie direkt mutiert.
- [ ] Das Notiz-Feld nutzt `multiline` und ist mindestens 3 Zeilen hoch.
- [ ] Ein "Alles löschen"-Button setzt das Formular auf den Anfangszustand zurück.

<details><summary>Hinweis</summary>

```jsx
const updateField = (field, value) =>
  setForm(prev => ({...prev, [field]: value}));

<LabeledInput
  label="Vorname"
  value={form.firstName}
  onChangeText={value => updateField('firstName', value)}
/>
```

`[field]` ist ein *computed property name*: Der Schlüssel wird zur Laufzeit bestimmt.
❌ Falsch wäre `form.firstName = value; setForm(form);` — gleiche Objektreferenz, React rendert nicht neu.

Definiere den Anfangszustand als Konstante `const EMPTY_FORM = {...}`, dann ist der Reset ein Einzeiler.
</details>

---

## Aufgabe 4.2 — Einträge zu einer Liste hinzufügen

Ein zweiter Screen-Teil: eine To-do-/Notizliste.

**Akzeptanzkriterien**

- [ ] Ein `TextInput` mit `onSubmitEditing` (Enter/Return) **und** ein Button "Hinzufügen" fügen den Text zur Liste hinzu.
- [ ] Nach dem Hinzufügen ist das Eingabefeld leer.
- [ ] Leere bzw. nur aus Leerzeichen bestehende Eingaben werden ignoriert.
- [ ] Die Liste wird mit `FlatList` gerendert; jeder Eintrag hat eine **stabile, eindeutige `key`/`id`** (nicht der Array-Index).
- [ ] Über der Liste steht die Anzahl der Einträge; bei leerer Liste erscheint `Noch keine Einträge.`
- [ ] Der State wird unveränderlich erweitert (`[...prev, neu]`, kein `push`).

<details><summary>Hinweis</summary>

```jsx
const [items, setItems] = useState([]);
const [draft, setDraft] = useState('');

const addItem = () => {
  const text = draft.trim();
  if (text === '') return;
  setItems(prev => [...prev, {id: Date.now().toString(), text, done: false}]);
  setDraft('');
};

<TextInput value={draft} onChangeText={setDraft} onSubmitEditing={addItem} />
<FlatList
  data={items}
  keyExtractor={item => item.id}
  renderItem={({item}) => <Text>{item.text}</Text>}
  ListEmptyComponent={<Text>Noch keine Einträge.</Text>}
/>
```

Warum kein Index als Key? Beim Löschen/Umsortieren verschieben sich die Indizes,
React ordnet dann State (z. B. Eingaben) den falschen Zeilen zu — probier es in 4.3 bewusst aus.
</details>

---

## Aufgabe 4.3 — Eigene Zeilen-Komponente mit Callback-Props

**Akzeptanzkriterien**

- [ ] Neue Komponente `ListItem` mit den Props `item`, `onToggle`, `onDelete`.
- [ ] Tippen auf den Text schaltet `done` um; erledigte Einträge werden durchgestrichen und grau.
- [ ] Ein "✕"-Button entfernt den Eintrag.
- [ ] `ListItem` hat **keinen eigenen State** — sie meldet Ereignisse nur nach oben.
- [ ] `onToggle`/`onDelete` bekommen die `id` des Eintrags, nicht den Index.
- [ ] Toggle und Delete aktualisieren den State unveränderlich (`map` / `filter`).

<details><summary>Hinweis</summary>

```jsx
const toggleItem = id =>
  setItems(prev => prev.map(i => (i.id === id ? {...i, done: !i.done} : i)));

const deleteItem = id =>
  setItems(prev => prev.filter(i => i.id !== id));

<ListItem item={item} onToggle={onToggle} onDelete={onDelete} />
// in ListItem:
<Pressable onPress={() => onToggle(item.id)}>…</Pressable>
```

`Pressable` und `TouchableOpacity` kommen aus `react-native`.
</details>

---

## Aufgabe 4.4 — Formular und Liste verbinden

**Akzeptanzkriterien**

- [ ] "Speichern" im Formular aus 4.1 legt einen Eintrag `"<Vorname> <Nachname> — <E-Mail>"` in der Liste an.
- [ ] Der Button ist deaktiviert, solange das Formular ungültig ist (Vorname ≥ 2 Zeichen, E-Mail enthält `@`).
- [ ] Nach dem Speichern ist das Formular wieder leer.
- [ ] Doppelte E-Mail-Adressen werden abgelehnt, mit sichtbarer Meldung.

---

## Reflexionsfragen

1. Warum reagiert React nicht, wenn du `items.push(...)` aufrufst und `setItems(items)` übergibst?
2. Wann brauchst du die Funktionsform `setState(prev => …)` und wann reicht `setState(wert)`?
3. Welche Vor- und Nachteile hat ein State-Objekt gegenüber vier einzelnen `useState`?
4. Wo genau lebt in deiner Lösung der State — und warum genau dort?
5. Welchen Fehler siehst du konkret, wenn du in 4.3 den Array-Index als Key benutzt?

➡️ Weiter mit [Stufe 5](stufe-5-bonus.md) · Lösung: [loesungen/stufe-4.md](../loesungen/stufe-4.md)
