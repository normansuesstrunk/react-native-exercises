# Stufe 2b — Liste mit Eingabefeld und Button

**Lernziele:** ein Array im State halten · Einträge **unveränderlich** hinzufügen (`[...prev, neu]`) · eine Liste rendern · das Eingabefeld nach dem Absenden leeren.

**Voraussetzung:** [Stufe 2](stufe-2-state.md) (kontrollierte Felder mit `value` + `onChangeText`).

**Zeit:** ca. 30 min

---

## Ausgangscode

Kopiere das in `App.js`. Das Eingabefeld funktioniert bereits, der Button tut noch nichts.

```jsx
import React, {useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';

export default function App() {
  const [text, setText] = useState('');   // Inhalt des Eingabefelds
  const [items, setItems] = useState([]); // die Liste — noch leer

  const addItem = () => {
    // TODO 2b.1: neuen Eintrag an die Liste anhängen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Einkaufsliste</Text>

      <TextInput
        style={styles.input}
        placeholder="Was soll auf die Liste?"
        value={text}
        onChangeText={setText}
      />
      <Button title="Hinzufügen" onPress={addItem} />

      {/* TODO 2b.3: hier die Liste anzeigen */}
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
  item: {paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee'},
  count: {fontWeight: '600'},
  hint: {color: '#666', fontStyle: 'italic'},
});
```

---

## Aufgabe 2b.1 — Einträge hinzufügen

**Akzeptanzkriterien**

- [ ] Ein Klick auf **"Hinzufügen"** hängt den aktuellen Text ans **Ende** der Liste an.
- [ ] Nach dem Hinzufügen ist das Eingabefeld **leer**.
- [ ] Die bisherigen Einträge bleiben erhalten (mehrfaches Hinzufügen funktioniert).
- [ ] Du verwendest **kein** `items.push(...)`.

<details><summary>Hinweis</summary>

Ein Array im State wird **nie verändert**, sondern durch ein **neues** ersetzt:

```js
setItems(prev => [...prev, text]);   // ✅ neues Array
items.push(text); setItems(items);   // ❌ gleiche Referenz → React rendert nicht neu
```

React vergleicht alten und neuen State per **Referenz**. `push` ändert den Inhalt, aber
die Referenz bleibt dieselbe — für React sieht das aus wie "keine Änderung".

Das Feld leerst du mit `setText('')`. Zwei `set…`-Aufrufe im selben Handler sind völlig
in Ordnung: React fasst sie zu **einem** Re-Render zusammen.
</details>

---

## Aufgabe 2b.2 — Leere Einträge verhindern

**Akzeptanzkriterien**

- [ ] Ein leeres Feld erzeugt **keinen** Eintrag.
- [ ] Auch reine Leerzeichen (`"   "`) erzeugen keinen Eintrag.
- [ ] Der Eintrag wird ohne führende/nachfolgende Leerzeichen gespeichert (`"  Brot "` → `"Brot"`).
- [ ] Der Button ist **ausgegraut** (`disabled`), solange nichts Gültiges im Feld steht.

<details><summary>Hinweis</summary>

```js
const trimmed = text.trim();
if (trimmed === '') return;   // früher Ausstieg
```

Für den Button brauchst du einen **abgeleiteten** Wert — keinen zweiten `useState`:

```jsx
const canAdd = text.trim().length > 0;
<Button title="Hinzufügen" onPress={addItem} disabled={!canAdd} />
```
</details>

---

## Aufgabe 2b.3 — Die Liste anzeigen

**Akzeptanzkriterien**

- [ ] Alle Einträge werden untereinander angezeigt — gerendert mit einer **`FlatList`**.
- [ ] Über der Liste steht die Anzahl: `3 Einträge`.
- [ ] Bei leerer Liste steht stattdessen `Noch nichts auf der Liste.` (und **keine** `0 Einträge`).
- [ ] Die Anzahl ist **berechnet**, nicht in einem eigenen `useState` gespeichert.
- [ ] Eine eigene Komponente `Item` rendert eine einzelne Zeile und bekommt den Text als Prop.

<details><summary>Hinweis</summary>

`FlatList` bekommt das Array als `data` und baut die Zeilen selbst — sie scrollt und
rendert nur, was gerade sichtbar ist. Nicht vergessen, sie oben zu importieren:
`import {Button, FlatList, StyleSheet, ...} from 'react-native';`

```jsx
// eine Zeile als eigene Komponente — bekommt den Text als Prop (Stufe 1)
function Item({title}) {
  return <Text style={styles.item}>{title}</Text>;
}

<FlatList
  data={items}
  renderItem={({item}) => <Item title={item} />}
  keyExtractor={(item, index) => String(index)}
/>
```

Drei Stolpersteine:

- `renderItem` bekommt **ein Objekt**, nicht den Eintrag selbst — daher `({item})`.
  Mit `renderItem={(item) => …}` bleiben die Zeilen leer.
- `title={item}` mit geschweiften Klammern. `title="{item}"` zeigt den Text `{item}`.
- Das `key`-Prop setzt `FlatList` selbst — den Wert liefert `keyExtractor`.

> Der Index als Key ist **nur** okay, solange ausschließlich hinten angehängt wird.
> Sobald gelöscht oder sortiert wird, gibt es Probleme — mehr dazu in Aufgabe 2b.5 und in [Stufe 4](stufe-4-formular-und-liste.md).

Anzahl (`items.length`) und Leer-Hinweis brauchen kein eigenes JSX daneben — dafür hat
`FlatList` eigene Props:

```jsx
  ListHeaderComponent={
    items.length === 0 ? null : <Text style={styles.count}>{items.length} Einträge</Text>
  }
  ListEmptyComponent={<Text style={styles.hint}>Noch nichts auf der Liste.</Text>}
```

Der Header wird **immer** gerendert, auch bei leerer Liste — deshalb dort `null`,
sonst steht `0 Einträge` über dem Hinweis.
</details>

---

## Aufgabe 2b.4 — Absenden mit der Return-Taste

**Akzeptanzkriterien**

- [ ] Die Return-Taste der Tastatur fügt den Eintrag genauso hinzu wie der Button.
- [ ] Button und Return-Taste rufen **dieselbe Funktion** auf (die Logik steht nur einmal im Code).
- [ ] Die Return-Taste ist mit "Fertig"/"Done" beschriftet.

<details><summary>Hinweis</summary>

```jsx
<TextInput
  ...
  onSubmitEditing={addItem}
  returnKeyType="done"
/>
```
</details>

---

## Aufgabe 2b.5 — Einträge wieder entfernen

**Akzeptanzkriterien**

- [ ] Ein Button **"Letzten entfernen"** löscht den zuletzt hinzugefügten Eintrag.
- [ ] Ein Button **"Alles löschen"** leert die Liste.
- [ ] Beide Buttons sind deaktiviert, solange die Liste leer ist.
- [ ] Du verwendest **kein** `pop()` und **kein** `splice()`.

<details><summary>Hinweis</summary>

Auch hier gilt: neues Array statt Mutation.

```js
setItems(prev => prev.slice(0, -1));   // letztes Element weg
setItems([]);                          // alles weg
```

`slice` gibt eine **Kopie** zurück, `splice` verändert das Original — die beiden Namen
sehen ähnlich aus, machen aber das Gegenteil.
</details>

---

## Bonus 2b.6 — Doppelte Einträge erkennen

**Akzeptanzkriterien**

- [ ] Ist der Eintrag bereits in der Liste (Groß-/Kleinschreibung egal), erscheint der Hinweis `"Brot" steht schon auf der Liste.`
- [ ] Der Eintrag wird in diesem Fall **nicht** hinzugefügt, das Feld bleibt gefüllt.
- [ ] Sobald wieder getippt wird, verschwindet die Meldung.

<details><summary>Hinweis</summary>

```js
const exists = items.some(i => i.toLowerCase() === trimmed.toLowerCase());
```

Für die Meldung ein eigener State: `const [error, setError] = useState(null)`.
Beim Tippen zurücksetzen — dafür brauchst du statt `onChangeText={setText}` eine
eigene kleine Funktion.

Achtung beim Rendern: `{error && <Text>{error}</Text>}` rendert bei einem **leeren String**
den String selbst und React Native wirft dann *"Text strings must be rendered within a
`<Text>` component"*. Sicherer ist ein Ternär mit explizitem `null`.
</details>

---

## Reflexionsfragen

1. Warum funktioniert `items.push(text)` nicht, obwohl das Array danach den neuen Eintrag enthält?
2. Was ist der Unterschied zwischen `setItems([...items, text])` und `setItems(prev => [...prev, text])`? In welcher Situation macht das einen Unterschied?
3. Warum ist `items.length` **kein** Fall für `useState`?
4. Wozu dient `keyExtractor` bei `FlatList` — und warum ist der Index nur eine Notlösung?
5. Die Liste enthält aktuell **Strings**. Was müsste sich ändern, um pro Eintrag zusätzlich ein Häkchen "erledigt" zu speichern?

➡️ Weiter mit [Stufe 3](stufe-3-props-und-state.md) · Lösung: [loesungen/stufe-2b.md](../loesungen/stufe-2b.md)
