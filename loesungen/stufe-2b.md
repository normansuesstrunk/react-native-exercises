# Lösung — Stufe 2b (Liste mit Eingabefeld und Button)

```jsx
import React, {useState} from 'react';
import {Button, FlatList, StyleSheet, Text, TextInput, View} from 'react-native';

// Eine eigene Komponente für eine Zeile: bekommt den Text als Prop (Stufe 1)
// und kümmert sich nur ums Aussehen eines einzelnen Eintrags.
function Item({title}) {
  return <Text style={styles.item}>{title}</Text>;
}

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

      {/* 2b.3: FlatList bekommt das Array als `data` und baut die Zeilen
          selbst. Sie scrollt und rendert nur, was gerade sichtbar ist. */}
      <FlatList
        data={items}
        // renderItem bekommt pro Eintrag ein Objekt — uns interessiert `item`.
        // Der String wird als Prop an <Item> weitergereicht.
        renderItem={({item}) => <Item title={item} />}
        // Das key-Prop setzt FlatList selbst; den Wert liefert keyExtractor.
        // Der Index reicht hier knapp — siehe Erklärung unten.
        keyExtractor={(item, index) => String(index)}
        // Anzahl ist berechnet (items.length), nicht gespeichert.
        // Bei leerer Liste kein Header, sonst stünde "0 Einträge" über dem Hinweis.
        ListHeaderComponent={
          isEmpty ? null : <Text style={styles.count}>{items.length} Einträge</Text>
        }
        ListEmptyComponent={<Text style={styles.hint}>Noch nichts auf der Liste.</Text>}
      />
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

**2b.3 — `FlatList` statt `map`.**
Ein Array lässt sich auch direkt mit `map` rendern — React rendert Arrays von JSX-Elementen:

```jsx
{items.map((item, index) => (
  <Text key={index} style={styles.item}>{item}</Text>
))}
```

Das ist für kurze Listen völlig in Ordnung, hat aber zwei Grenzen: es rendert **alle**
Einträge auf einmal, und die Liste **scrollt nicht**. `FlatList` nimmt einem beides ab:

| `map` | `FlatList` |
|---|---|
| Array direkt in JSX | `data={items}` |
| `key={...}` am Element | `keyExtractor={(item, index) => ...}` |
| JSX im `map`-Callback | `renderItem={({item}) => ...}` |
| eigenes Ternär für "leer" | `ListEmptyComponent` |
| eigener `<Text>` darüber | `ListHeaderComponent` |
| rendert alles | rendert nur das Sichtbare, scrollt |

Wichtig bei `renderItem`: der Callback bekommt **ein Objekt**, nicht den Eintrag selbst —
daher das Destructuring `({item})`. Ein häufiger Anfängerfehler ist `renderItem={(item) => …}`;
dann ist `item` das Wrapper-Objekt und die Zeile bleibt leer.

**Die Zeile als eigene Komponente.** `renderItem` gibt hier nicht direkt `<Text>` zurück,
sondern `<Item title={item} />`. Damit landet das Aussehen einer Zeile an einer Stelle und
`App` beschreibt nur noch die Liste — genau die Props-Idee aus [Stufe 1](../uebungen/stufe-1-props.md).

Zweiter klassischer Stolperstein dabei: die geschweiften Klammern.

```jsx
<Item title={item} />    // ✅ der Wert aus der Variablen
<Item title="{item}" />  // ❌ der literale Text "{item}" in jeder Zeile
```

Das `key`-Prop setzt man bei `FlatList` **nicht** selbst ans Element — den Wert liefert
`keyExtractor`. Der Index als Key ist hier vertretbar, weil nur **hinten** angehängt und
entfernt wird; die Zuordnung Index → Eintrag bleibt dabei stabil. Sobald vorne oder in der
Mitte gelöscht, eingefügt oder sortiert wird, rutschen alle Indizes und React recycelt den
internen Zustand der falschen Zeile. Dann braucht es eine stabile `id` pro Eintrag →
[Stufe 4](stufe-4.md).

`FlatList` bringt eigenes Scrolling mit. Deshalb gehört sie **nicht** in eine `ScrollView`
— zwei verschachtelte Scroll-Container vertragen sich nicht, und React Native warnt davor.

**Ausblick (Reflexionsfrage 5).**
Für ein "erledigt"-Häkchen reichen Strings nicht mehr; jeder Eintrag wird zum Objekt:

```js
{id: String(Date.now()), text: trimmed, done: false}
```

Damit ändert sich das Hinzufügen kaum (`[...prev, neuesObjekt]`), aber Umschalten und
Löschen laufen über `map`/`filter` mit der `id` statt über den Index — genau das ist der
Inhalt von [Stufe 4](stufe-4.md).

**Grenze dieser Lösung.** Die Einträge sind schlichte Strings, und der Key ist der Index.
Beides trägt nur, solange ausschließlich hinten angehängt und entfernt wird. Sobald
Einträge einzeln gelöscht, umsortiert oder verändert werden, braucht jeder Eintrag eine
eigene `id` — und `keyExtractor` liefert dann `item.id` statt des Index →
[Stufe 4](stufe-4.md).
