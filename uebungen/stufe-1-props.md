# Stufe 1 — Props (Einstieg)

**Lernziele:** Props übergeben und lesen · Komponenten mehrfach mit unterschiedlichen Daten verwenden · Default-Werte · Props sind read-only.

**Voraussetzung:** keine.

---

## Ausgangscode

```jsx
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Greeting = () => {
  return <Text style={styles.greeting}>Hallo, Welt!</Text>;
};

export default function App() {
  return (
    <View style={styles.container}>
      <Greeting />
      <Greeting />
      <Greeting />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 24, gap: 12},
  greeting: {fontSize: 20},
});
```

---

## Aufgabe 1.1 — Begrüßung personalisieren

Erweitere `Greeting` so, dass der Name von außen kommt.

**Akzeptanzkriterien**

- [ ] `Greeting` akzeptiert eine Prop `name` und rendert `Hallo, <name>!`.
- [ ] In `App` werden drei `Greeting` mit **unterschiedlichen** Namen gerendert (z. B. Ada, Linus, Grace).
- [ ] Der Text `Hallo,` steht nur **einmal** im Code (in `Greeting`), nicht dreimal in `App`.

<details><summary>Hinweis</summary>

Props kommen als **erstes Argument** (ein Objekt) in die Funktion:

```jsx
const Greeting = (props) => <Text>Hallo, {props.name}!</Text>;
// oder mit Destructuring:
const Greeting = ({name}) => <Text>Hallo, {name}!</Text>;
```

Geschweifte Klammern in JSX bedeuten: "hier kommt ein JavaScript-Ausdruck".
</details>

---

## Aufgabe 1.2 — Mehrere Props und ein Default-Wert

Baue eine Komponente `Badge`, die ein Label und eine Zahl anzeigt.

**Akzeptanzkriterien**

- [ ] `Badge` nimmt die Props `label` (String) und `count` (Zahl) entgegen: `<Badge label="Nachrichten" count={3} />`.
- [ ] Ausgabe z. B.: `Nachrichten: 3`.
- [ ] Fehlt `count`, wird **0** angezeigt (Default-Wert) — `<Badge label="Entwürfe" />` → `Entwürfe: 0`.
- [ ] Ist `count` größer als 0, wird das Label **fett** dargestellt, sonst normal (bedingtes Styling).

<details><summary>Hinweis</summary>

Default-Werte gibt man beim Destructuring an:

```jsx
const Badge = ({label, count = 0}) => { ... };
```

Bedingtes Styling über ein Array von Styles:

```jsx
<Text style={[styles.label, count > 0 && styles.bold]}>…</Text>
```

Achtung: Zahlen müssen in geschweifte Klammern (`count={3}`), Strings gehen direkt (`label="Neu"`).
</details>

---

## Aufgabe 1.3 — Props sind read-only

Baue den Fehler bewusst ein und analysiere ihn.

```jsx
const Greeting = (props) => {
  props.name = props.name.toUpperCase(); // ❌ Mutation einer Prop
  return <Text>Hallo, {props.name}!</Text>;
};
```

**Akzeptanzkriterien**

- [ ] Du kannst in **einem Satz** erklären, warum diese Zeile falsch ist.
- [ ] Du hast den Code korrigiert, sodass der Name großgeschrieben angezeigt wird, **ohne** die Prop zu verändern.
- [ ] Bonus: Die Großschreibung ist über eine Prop `uppercase` (Boolean, Default `false`) ein-/ausschaltbar.

<details><summary>Hinweis</summary>

Eine Komponente muss sich wie eine **reine Funktion** verhalten: gleiche Props → gleiche Ausgabe,
keine Seiteneffekte auf die Eingaben. Berechne stattdessen einen **lokalen Wert**:

```jsx
const displayName = uppercase ? name.toUpperCase() : name;
```
</details>

---

## Reflexionsfragen

1. Wer bestimmt den Wert einer Prop — die Komponente selbst oder ihr Aufrufer?
2. Warum ist es sinnvoll, dass Props nicht verändert werden dürfen?
3. `<Badge count={3} />` vs. `<Badge count="3" />` — was ist der Unterschied und wann fällt er auf?
4. Welche Daten in dieser Übung ändern sich zur Laufzeit? (Antwort: keine — deshalb reicht hier Props, kein State.)

➡️ Weiter mit [Stufe 2](stufe-2-state.md) · Lösung: [loesungen/stufe-1.md](../loesungen/stufe-1.md)
