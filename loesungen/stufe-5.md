# Lösung — Stufe 5 (Bonus)

## 5.1 – 5.2 · Filter + Debounce

```jsx
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, TextInput, View} from 'react-native';

export default function App() {
  const [items, setItems] = useState([
    {id: '1', text: 'Milch', done: false},
    {id: '2', text: 'Brot', done: false},
    {id: '3', text: 'Kaffeebohnen', done: true},
  ]);
  const [query, setQuery] = useState('');                 // sofort
  const [debouncedQuery, setDebouncedQuery] = useState(''); // verzögert

  // 5.2: Der Timer wird bei jeder Änderung von `query` neu gesetzt und
  // der vorherige im Cleanup abgeräumt -> nur die letzte Eingabe "überlebt".
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(id);
  }, [query]);

  // 5.1: abgeleitete Liste, KEIN State
  const visible = useMemo(() => {
    const needle = debouncedQuery.trim().toLowerCase();
    if (needle === '') return items;
    return items.filter(i => i.text.toLowerCase().includes(needle));
  }, [items, debouncedQuery]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Suchen…"
        value={query}
        onChangeText={setQuery}
      />
      <Text>
        {visible.length} von {items.length} Einträgen
      </Text>
      <FlatList
        data={visible}
        keyExtractor={item => item.id}
        renderItem={({item}) => <Text style={styles.item}>{item.text}</Text>}
        ListEmptyComponent={
          <Text style={styles.hint}>Keine Treffer für "{debouncedQuery}".</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, gap: 8},
  input: {height: 44, borderWidth: 1, borderColor: '#999', borderRadius: 8, paddingHorizontal: 12},
  item: {paddingVertical: 8},
  hint: {color: '#666'},
});
```

**Warum die gefilterte Liste kein State sein darf:** Ein `useState` mit `filteredItems` müsste
bei *jeder* Änderung von `items` **und** von `query` nachgezogen werden. Vergisst man einen Pfad
(z. B. das Löschen eines Eintrags), zeigt die Liste Daten, die es nicht mehr gibt. Berechnen beim
Rendern kann per Konstruktion nicht veralten.

**Ohne `clearTimeout`** liefe pro Tastendruck ein eigener Timer weiter: Bei "Kaffee" sechs Timer,
die nacheinander feuern und `debouncedQuery` sechsmal setzen — der Debounce-Effekt wäre wirkungslos,
und beim Verlassen des Screens schriebe ein noch laufender Timer in eine unmontierte Komponente.

**Lohnt sich `useMemo` hier?** Ehrliche Antwort: nein. Der Filter über wenige Einträge kostet
Mikrosekunden; `useMemo` selbst kostet Speicher und Lesbarkeit. Sinnvoll wird es bei teuren
Berechnungen über große Datenmengen oder wenn das Ergebnis als Prop an eine `memo`-Komponente geht.

---

## 5.3 · `useReducer`

```jsx
import React, {useReducer} from 'react';

const EMPTY_FORM = {firstName: '', lastName: '', email: '', note: ''};

// Reine Funktion, außerhalb der Komponente -> isoliert testbar
function formReducer(state, action) {
  switch (action.type) {
    case 'change':
      return {...state, [action.field]: action.value};
    case 'reset':
      return EMPTY_FORM;
    case 'submit':
      return EMPTY_FORM;
    default:
      throw new Error(`Unbekannte Action: ${action.type}`);
  }
}

function FormScreen() {
  const [form, dispatch] = useReducer(formReducer, EMPTY_FORM);

  const change = (field, value) => dispatch({type: 'change', field, value});
  // …
}
```

**Wann `useReducer`?** Wenn mehrere Werte zusammenhängend geändert werden, Übergänge Regeln folgen
("submit leert das Formular und setzt `touched` zurück") oder dieselbe Änderung von vielen Stellen
ausgelöst wird. Der Reducer bündelt die Logik an einem Ort und ist ohne React testbar.
Bei ein bis zwei unabhängigen Werten bleibt `useState` einfacher — `useReducer` ist dort Overhead.

---

## 5.4 · Eigener Hook

```jsx
import {useCallback, useState} from 'react';

export function useTextField(initial = '', {validate} = {}) {
  const [value, setValue] = useState(initial);
  const [touched, setTouched] = useState(false);

  const reset = useCallback(() => {
    setValue(initial);
    setTouched(false);
  }, [initial]);

  const error = validate ? validate(value) : null;

  return {
    value,
    onChangeText: setValue,
    onBlur: () => setTouched(true),
    error: touched ? error : null,
    touched,
    reset,
  };
}

// Verwendung:
const email = useTextField('', {validate: v => (v.includes('@') ? null : 'Ungültig')});
<LabeledInput label="E-Mail" {...email} />
```

Ein Custom Hook ist einfach eine Funktion, die andere Hooks aufruft. Er kapselt **Logik**
(nicht Markup) und macht sie wiederverwendbar. Jeder Aufruf erzeugt **eigenen, unabhängigen State** —
zwei `useTextField()`-Aufrufe teilen nichts miteinander. Die Namenskonvention `use…` ist keine
Kosmetik: Daran erkennen Linter, dass die Regeln der Hooks gelten (kein Aufruf in Bedingungen,
Schleifen oder verschachtelten Funktionen).

---

## 5.5 · `memo` + `useCallback`

```jsx
const ListItem = React.memo(({item, onToggle, onDelete}) => {
  console.log('render', item.text);
  return (/* … */);
});

// in App:
const toggleItem = useCallback(
  id => setItems(prev => prev.map(i => (i.id === id ? {...i, done: !i.done} : i))),
  [], // stabile Referenz: dank prev => … wird kein `items` aus dem Scope gebraucht
);
```

**Warum `memo` ohne `useCallback` wirkungslos ist:** `React.memo` überspringt das Rendern nur, wenn
**alle** Props flach gleich sind (`===`). Bei jedem Render von `App` entsteht mit
`onToggle={id => …}` ein **neues Funktionsobjekt**; `neueFn === alteFn` ist immer `false`, also
rendert das Kind trotzdem — man zahlt den Vergleich zusätzlich zum Render.
`useCallback(fn, [])` hält die Referenz über Renders hinweg stabil, erst dann greift `memo`.

Beachte, dass `[]` als Abhängigkeitsliste nur funktioniert, weil `setItems(prev => …)` benutzt wird.
Stünde dort `setItems(items.map(…))`, müsste `items` in die Deps — und die Referenz änderte sich
bei jeder Listenänderung wieder.

**Lohnt sich das?** Bei 12 Zeilen: nein, die Renders sind nicht messbar. Relevant wird es bei
langen Listen (Hunderte Einträge), teuren Kindkomponenten (Diagramme, Bilder, aufwändige Layouts)
oder sehr häufigen Updates (Tippen, Animationen). Vorgehen: erst mit dem Profiler messen,
dann gezielt optimieren — nicht prophylaktisch alles einwickeln.

---

## Bewertungshinweise zu 5.6 (freie Aufgabe)

Achte bei der Abnahme besonders auf:

- **Redundanter State** — der häufigste Fehler (z. B. `count` neben der Liste, `isValid` neben den Feldern).
- **Mutation** — `push`, `sort`, direkte Zuweisung an State-Objekte.
- **State am falschen Ort** — zu tief (Geschwister kommen nicht dran) oder zu hoch (unnötige Re-Renders).
- **Index als Key** in dynamischen Listen.
- **Fehlender `trim()`/leere Eingaben** — reine Sorgfaltsfrage, zeigt sich sofort beim Ausprobieren.
