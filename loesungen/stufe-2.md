# Lösung — Stufe 2 (State & Texteingabe)

```jsx
import React, {useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const EMOJI = '🍕';
const MAX = 50;

export default function App() {
  // 2.1 / 2.2: eine einzige Quelle der Wahrheit für den Text
  const [text, setText] = useState('');

  // 2.4: zweites, unabhängiges Feld-Paar
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // --- abgeleitete Werte: NICHT im State! ---
  const words = text.split(' ').filter(word => word.length > 0);
  const isEmpty = text.trim().length === 0;
  const counterColor =
    text.length >= MAX ? '#c62828' : text.length >= 40 ? '#ef6c00' : '#666';

  const greeting =
    firstName.trim() && lastName.trim()
      ? `Hallo, ${firstName.trim()} ${lastName.trim()}!`
      : 'Bitte beide Felder ausfüllen.';

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Tippe hier zum Übersetzen!"
        onChangeText={setText}   // liefert den neuen String direkt
        value={text}             // 2.2: kontrolliertes Feld
        maxLength={MAX}
      />

      <Text style={styles.pizza}>{words.map(() => EMOJI).join(' ')}</Text>
      <Text>{words.length} Wörter</Text>
      <Text style={{color: counterColor}}>
        {text.length} / {MAX} Zeichen
      </Text>

      <View style={styles.row}>
        <Button title="Zurücksetzen" onPress={() => setText('')} />
        <Button title="Großschreiben" onPress={() => setText(text.toUpperCase())} />
        <Button title="Absenden" disabled={isEmpty} onPress={() => {}} />
      </View>

      <View style={styles.spacer} />

      <TextInput
        style={styles.input}
        placeholder="Vorname"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nachname"
        value={lastName}
        onChangeText={setLastName}
      />
      <Text style={styles.greeting}>{greeting}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 24, gap: 10},
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  pizza: {fontSize: 36},
  row: {flexDirection: 'row', gap: 8, flexWrap: 'wrap'},
  spacer: {height: 24},
  greeting: {fontSize: 18},
});
```

## Erklärungen

**2.1 — abgeleitete Werte.** `words` wird bei jedem Render neu berechnet und ist damit
automatisch aktuell. Ein zweiter State `wordCount` müsste bei *jeder* Textänderung
mitgepflegt werden — vergisst man eine Stelle, zeigt die App widersprüchliche Daten
("3 Wörter" bei leerem Feld). Regel: **kein State für Werte, die sich aus State ableiten lassen.**

`filter(word => word.length > 0)` löst das `0 Wörter`-Kriterium: `''.split(' ')` ergibt `['']`,
also ein Element mit leerem String.

**2.2 — kontrolliert vs. unkontrolliert.**
`defaultValue` gibt dem Feld nur einen **Startwert**; danach verwaltet die native
Textkomponente ihren Inhalt selbst. `setText('')` ändert dann zwar den State, aber das Feld
zeigt weiter den alten Text — State und Anzeige laufen auseinander.
Mit `value={text}` rendert React das Feld bei jeder State-Änderung neu; der State ist die
einzige Quelle der Wahrheit und Buttons wie "Zurücksetzen" funktionieren.

**Ablauf beim Tippen:** Tastendruck → `onChangeText('abc')` → `setText('abc')` → React
markiert die Komponente als veraltet → Re-Render → `value` ist `'abc'`.
Eine einfache Zuweisung `text = 'abc'` löst diesen Zyklus nicht aus; React weiß nichts davon.

**2.4** Zwei getrennte States sind hier richtig, weil die Werte unabhängig sind.
Ab ca. vier zusammengehörigen Feldern lohnt ein State-Objekt → Stufe 4.
`trim()` in der Prüfung *und* in der Ausgabe verhindert doppelte Leerzeichen.
