# Stufe 2 — State & Texteingabe

**Lernziele:** `useState` verwenden · kontrollierte Eingabefelder (`value` + `onChangeText`) · abgeleitete Werte statt redundantem State.

**Voraussetzung:** [Stufe 1](stufe-1-props.md).

---

## Ausgangscode (aus der React-Native-Doku)

```jsx
import React, {useState} from 'react';
import {StyleSheet, Text, TextInput} from 'react-native';

export default function App() {
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Tippe hier zum Übersetzen!"
        onChangeText={newText => setText(newText)}
        defaultValue={text}
      />
      <Text style={styles.pizza}>
        {text.split(' ').map(word => word && '🍕').join(' ')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 24, gap: 12},
  input: {height: 44, borderWidth: 1, borderColor: '#999', borderRadius: 8, paddingHorizontal: 12},
  pizza: {fontSize: 36},
});
```

Führe diesen Code zuerst aus und tippe ein paar Wörter. **Jedes Wort wird zu 🍕.**

---

## Aufgabe 2.1 — Den PizzaTranslator verstehen und verändern

**Akzeptanzkriterien**

- [ ] Ergänze eine Zeile, die die **Anzahl der Wörter** anzeigt (`3 Wörter`).
- [ ] Leere Eingabe zeigt `0 Wörter` (nicht `1`).
- [ ] Ersetze 🍕 durch ein Emoji, das per Konstante am Dateianfang konfigurierbar ist (`const EMOJI = '🍕';`).
- [ ] Der Zähler wird **berechnet**, nicht in einem zweiten `useState` gespeichert.

<details><summary>Hinweis</summary>

```js
const words = text.split(' ').filter(w => w.length > 0);
words.length // ← abgeleiteter Wert
```

Merksatz: **Alles, was sich aus vorhandenem State berechnen lässt, gehört nicht in den State.**
Sonst können beide Werte auseinanderlaufen.
</details>

---

## Aufgabe 2.2 — Vom unkontrollierten zum kontrollierten Feld

Der Ausgangscode nutzt `defaultValue`. Damit bestimmt das Feld selbst, was es anzeigt —
React kennt den Wert nur als Kopie im State.

**Akzeptanzkriterien**

- [ ] `defaultValue={text}` ist durch `value={text}` ersetzt.
- [ ] Es gibt einen Button **"Zurücksetzen"**, der das Feld sichtbar leert.
- [ ] Es gibt einen Button **"Großschreiben"**, der den aktuellen Text in Großbuchstaben ins Feld schreibt.
- [ ] Du hast getestet: Mit `defaultValue` funktionieren diese Buttons **nicht** — du kannst erklären, warum.

<details><summary>Hinweis</summary>

Kontrolliertes Feld = der State ist die **einzige Quelle der Wahrheit**:

```jsx
<TextInput value={text} onChangeText={setText} />
<Button title="Zurücksetzen" onPress={() => setText('')} />
```

`setText` kann direkt übergeben werden — `onChangeText` liefert bereits den neuen String als Argument.
`Button` aus `react-native` importieren.
</details>

---

## Aufgabe 2.3 — Zeichenzähler mit Limit

**Akzeptanzkriterien**

- [ ] Unter dem Feld steht `12 / 50 Zeichen`.
- [ ] `maxLength={50}` verhindert längere Eingaben.
- [ ] Ab 40 Zeichen wird der Zähler **orange**, ab 50 **rot**.
- [ ] Der Button "Absenden" ist deaktiviert (`disabled`), solange das Feld leer ist oder nur Leerzeichen enthält.

<details><summary>Hinweis</summary>

```jsx
const length = text.length;
const isEmpty = text.trim().length === 0;
```

Farbe als abgeleiteter Wert bestimmen, z. B. mit einer kleinen Hilfsfunktion oder einem Ternär-Ausdruck —
**nicht** über einen zusätzlichen State + `if` beim Tippen.
</details>

---

## Aufgabe 2.4 — Zwei unabhängige States

Erweitere den Screen um ein zweites Eingabefeld (z. B. "Vorname" und "Nachname").

**Akzeptanzkriterien**

- [ ] Beide Felder sind kontrolliert und haben je einen eigenen `useState`.
- [ ] Darunter erscheint live: `Hallo, <Vorname> <Nachname>!`.
- [ ] Ist eines der Felder leer, erscheint stattdessen `Bitte beide Felder ausfüllen.`
- [ ] Es entstehen keine überflüssigen Leerzeichen in der Ausgabe.

---

## Reflexionsfragen

1. Was passiert **genau**, wenn `setText` aufgerufen wird? (Stichwort: Re-Render)
2. Warum funktioniert `text = 'neu';` nicht, um die Anzeige zu ändern?
3. Wann ist ein Feld "kontrolliert" und welchen Vorteil bringt das?
4. Warum ist ein zusätzliches `const [wordCount, setWordCount] = useState(0)` in Aufgabe 2.1 eine schlechte Idee?

➡️ Weiter mit [Stufe 3](stufe-3-props-und-state.md) · Lösung: [loesungen/stufe-2.md](../loesungen/stufe-2.md)
