# Lösung — Stufe 1 (Props)

```jsx
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

// 1.1 + 1.3: Props werden gelesen, nie verändert.
// Der abgeleitete Wert wird lokal berechnet.
const Greeting = ({name, uppercase = false}) => {
  const displayName = uppercase ? name.toUpperCase() : name;
  return <Text style={styles.greeting}>Hallo, {displayName}!</Text>;
};

// 1.2: mehrere Props, Default-Wert, bedingtes Styling
const Badge = ({label, count = 0}) => (
  <Text style={[styles.badge, count > 0 && styles.bold]}>
    {label}: {count}
  </Text>
);

export default function App() {
  return (
    <View style={styles.container}>
      <Greeting name="Ada" />
      <Greeting name="Linus" />
      <Greeting name="Grace" uppercase />

      <View style={styles.spacer} />

      <Badge label="Nachrichten" count={3} />
      <Badge label="Entwürfe" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 24, gap: 8},
  greeting: {fontSize: 20},
  badge: {fontSize: 16},
  bold: {fontWeight: 'bold'},
  spacer: {height: 24},
});
```

## Erklärungen

**1.1** `Greeting` kennt nur die Struktur ("Hallo, X!"), die Daten kommen vom Aufrufer.
Deshalb steht der Text genau einmal im Code — die Komponente ist wiederverwendbar.

**1.2** `count = 0` beim Destructuring ist der moderne Ersatz für `defaultProps`.
`<Greeting uppercase />` ohne Wert bedeutet `uppercase={true}`.
`count={3}` übergibt die **Zahl** 3, `count="3"` den **String** — bei `count > 0` fällt das
nicht auf, bei `count + 1` schon (`"31"` statt `4`).

**1.3** `props.name = ...` mutiert die Eingabe der Funktion. React geht davon aus, dass
Komponenten sich wie reine Funktionen verhalten: gleiche Props → gleiche Ausgabe, keine
Seiteneffekte. Mutierte Props gehören dem Aufrufer und können dort zu unerklärlichen
Fehlern führen; im StrictMode/Concurrent-Rendering kann eine Komponente außerdem mehrfach
gerendert werden, wodurch die Mutation sich potenziert.

**Kernaussage der Stufe:** Nichts hier ändert sich zur Laufzeit — deshalb reicht Props.
State kommt erst, wenn Werte sich über die Zeit ändern.
