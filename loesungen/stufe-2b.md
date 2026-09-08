# Lösung — Stufe 2b (Liste mit Eingabefeld und Button)

```jsx
import React, {useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';

export default function App() {
  const [text, setText] = useState('');     // Inhalt des Eingabefelds
  const [items, setItems] = useState([]);   // die Liste (Array von Strings)
  const [error, setError] = useState(null); // 2b.6: Hinweis bei Duplikat

  // 2b.2: abgeleitete Werte — kein eigener useState, sondern bei jedem
  // Render neu berechnet. So können sie nie veralten.
  const trimmed = text.trim();
  const canAdd = trimmed.length > 0;
  const isEmpty = items.length === 0;

  // 2b.1 + 2b.2 + 2b.6: eine Funktion, die alles erledigt.
  const addItem = () => {
    if (!canAdd) return;   // leer oder nur Leerzeichen -> nichts tun

    // 2b.6: Duplikat? some() bricht beim ersten Treffer ab.
    if (items.some(i => i.toLowerCase() === trimmed.toLowerCase())) {
      setError(`"${trimmed}" steht schon auf der Liste.`);
      return;              // Feld bewusst NICHT leeren, damit man korrigieren kann
    }

    // Unveränderlich anhängen: [...prev] kopiert das alte Array, `trimmed`
    // kommt hinten dran. Das Ergebnis ist ein NEUES Array — nur deshalb
    // erkennt React (Vergleich per Referenz) die Änderung und rendert neu.
    // items.push(trimmed) würde die Referenz behalten -> kein Re-Render.
    setItems(prev => [...prev, trimmed]);

    setText('');           // Feld leeren
    setError(null);
    // Drei set...-Aufrufe, aber nur EIN Re-Render: React bündelt sie ("batching").
  };

  // 2b.6: beim Tippen die Fehlermeldung wieder wegräumen. Deshalb hier eine
  // eigene Funktion statt onChangeText={setText}.
  const handleChangeText = value => {
    setText(value);
    if (error) setError(null);
  };

  // 2b.5: slice statt pop/splice — slice liefert eine Kopie, splice mutiert.
  const removeLast = () => setItems(prev => prev.slice(0, -1));
  const clearAll = () => setItems([]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Einkaufsliste</Text>

      <TextInput
        style={styles.input}
        placeholder="Was soll auf die Liste?"
        // kontrolliertes Feld: der State bestimmt, was angezeigt wird —
        // nur deshalb kann setText('') das Feld überhaupt leeren.
        value={text}
        onChangeText={handleChangeText}
        // 2b.4: Return-Taste ruft dieselbe Funktion auf wie der Button.
        onSubmitEditing={addItem}
        returnKeyType="done"       // beschriftet die Return-Taste
      />

      {/* Ternär mit explizitem null statt `error && ...`: bei einem leeren
          String würde `&&` diesen rendern und RN wirft dann
          "Text strings must be rendered within a <Text> component". */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Hinzufügen" onPress={addItem} disabled={!canAdd} />

      <View style={styles.buttons}>
        <Button title="Letzten entfernen" onPress={removeLast} disabled={isEmpty} />
        <Button title="Alles löschen" onPress={clearAll} disabled={isEmpty} />
      </View>

      {/* 2b.3: Anzahl ist berechnet (items.length), nicht gespeichert. */}
      {isEmpty ? (
        <Text style={styles.hint}>Noch nichts auf der Liste.</Text>
      ) : (
        <Text style={styles.count}>{items.length} Einträge</Text>
      )}

      {/* map wandelt jedes Array-Element in ein JSX-Element um.
          key hilft React, die Zeilen zwischen zwei Renders zuzuordnen.
          Der Index reicht hier knapp, weil nur angehängt und hinten
          entfernt wird — siehe Erklärung unten. */}
      {items.map((item, index) => (
        <Text key={index} style={styles.item}>
          {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 24, gap: 12},
  title: {fontSize: 22, fontWeight: '600'},
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  buttons: {flexDirection: 'row', gap: 8},
  item: {paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee'},
  count: {fontWeight: '600'},
  hint: {color: '#666', fontStyle: 'italic'},
  error: {color: '#c62828'},
});
```

## Erklärungen

**2b.1 — Warum `[...prev, x]` und nicht `push`?**
React vergleicht alten und neuen State per Referenz (`Object.is`). `push` verändert den
**Inhalt** des Arrays, die Referenz bleibt aber dieselbe — React sieht "kein neuer Wert"
und rendert nicht neu. Der Eintrag wäre im Speicher, aber nicht auf dem Bildschirm.
Der Spread `[...prev, x]` erzeugt dagegen ein neues Array mit neuer Referenz.

Dieselbe Regel in allen Varianten:

| Ziel | ❌ mutierend | ✅ unveränderlich |
|---|---|---|
| anhängen | `push` | `[...prev, x]` |
| letztes entfernen | `pop` | `prev.slice(0, -1)` |
| einzelnes entfernen | `splice` | `prev.filter(i => i !== x)` |
| ändern | `arr[0] = x` | `prev.map((i, n) => (n === 0 ? x : i))` |
| sortieren | `sort` | `[...prev].sort()` |

`slice` und `splice` sind der klassische Stolperstein: ähnliche Namen, gegenteiliges
Verhalten. `sort` und `reverse` mutieren ebenfalls — deshalb vorher kopieren.

**Funktionsform `setItems(prev => …)`.**
`setItems([...items, trimmed])` funktioniert hier ebenfalls, weil pro Klick nur ein
Update passiert. Sobald zwei Updates im selben Event stattfinden, geht es schief:

```js
setItems([...items, 'a']);
setItems([...items, 'b']);   // liest dasselbe, veraltete `items` -> 'a' geht verloren
```

Mit `prev => …` bekommt jeder Aufruf den aktuellen Stand. Faustregel: **hängt der neue
Wert vom alten ab, immer die Funktionsform.**

**Batching.** `addItem` ruft `setItems`, `setText` und `setError` nacheinander auf.
React sammelt diese Aufrufe und rendert **einmal** am Ende des Event-Handlers — nicht
dreimal. Man darf State-Updates also ruhig aufteilen, statt sie künstlich zusammenzufassen.

**2b.2 — Abgeleitete Werte.**
`canAdd` und `isEmpty` werden bei jedem Render neu berechnet. Ein zusätzliches
`const [canAdd, setCanAdd] = useState(false)` müsste man an jeder Stelle mitpflegen,
die `text` ändert — vergisst man eine, ist der Button falsch ausgegraut.
Merksatz aus [Stufe 2](../uebungen/stufe-2-state.md): **Was sich aus State berechnen
lässt, gehört nicht in den State.**

**Kontrolliertes Feld.**
Dass `setText('')` das Eingabefeld sichtbar leert, funktioniert nur wegen `value={text}`.
Mit `defaultValue` würde der State geleert, das Feld aber weiter den alten Text zeigen.

**2b.3 — `map` und `key`.**
`map` liefert ein Array von JSX-Elementen; React rendert Arrays direkt. Das `key`-Prop
sagt React, welches Element zwischen zwei Renders "dasselbe" ist.

Der Index als Key ist hier vertretbar, weil nur **hinten** angehängt und entfernt wird —
die Zuordnung Index → Eintrag bleibt dabei stabil. Sobald vorne oder in der Mitte gelöscht,
eingefügt oder sortiert wird, rutschen alle Indizes und React recycelt den internen Zustand
der falschen Zeile. Dann braucht es eine stabile `id` pro Eintrag → [Stufe 4](stufe-4.md).

**Ausblick (Reflexionsfrage 5).**
Für ein "erledigt"-Häkchen reichen Strings nicht mehr; jeder Eintrag wird zum Objekt:

```js
{id: String(Date.now()), text: trimmed, done: false}
```

Damit ändert sich das Hinzufügen kaum (`[...prev, neuesObjekt]`), aber Umschalten und
Löschen laufen über `map`/`filter` mit der `id` statt über den Index — genau das ist der
Inhalt von [Stufe 4](stufe-4.md).

**Grenze dieser Lösung.** `items.map(...)` rendert **alle** Einträge auf einmal und die
Liste scrollt nicht. Für kurze Listen ist das richtig und am einfachsten. Ab vielen
Einträgen übernimmt `FlatList` (rendert nur das Sichtbare) → [Stufe 4](stufe-4.md).
