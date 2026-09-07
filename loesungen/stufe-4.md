# Lösung — Stufe 4 (Objekt-State & Liste)

```jsx
import React, {useState} from 'react';
import {
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const EMPTY_FORM = {firstName: '', lastName: '', email: '', note: ''};

// --- Präsentationskomponenten: kein eigener State ---------------------------

const LabeledInput = ({label, value, onChangeText, ...inputProps}) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, inputProps.multiline && styles.multiline]}
      value={value}
      onChangeText={onChangeText}
      {...inputProps}
    />
  </View>
);

// 4.3: meldet Ereignisse über Callback-Props nach oben, hält nichts selbst
const ListItem = ({item, onToggle, onDelete}) => (
  <View style={styles.row}>
    <Pressable style={styles.grow} onPress={() => onToggle(item.id)}>
      <Text style={item.done && styles.done}>{item.text}</Text>
    </Pressable>
    <Pressable onPress={() => onDelete(item.id)} hitSlop={8}>
      <Text style={styles.delete}>✕</Text>
    </Pressable>
  </View>
);

// --- Container: hält den State ---------------------------------------------

export default function App() {
  const [form, setForm] = useState(EMPTY_FORM);   // 4.1
  const [items, setItems] = useState([]);         // 4.2
  const [draft, setDraft] = useState('');
  const [formError, setFormError] = useState(null);

  // 4.1: eine generische Änderungsfunktion für alle Felder
  const updateField = (field, value) =>
    setForm(prev => ({...prev, [field]: value}));

  const addItem = text => {
    const trimmed = text.trim();
    if (trimmed === '') return false;
    setItems(prev => [...prev, {id: String(Date.now()), text: trimmed, done: false}]);
    return true;
  };

  const submitDraft = () => {
    if (addItem(draft)) setDraft('');
  };

  const toggleItem = id =>
    setItems(prev => prev.map(i => (i.id === id ? {...i, done: !i.done} : i)));

  const deleteItem = id => setItems(prev => prev.filter(i => i.id !== id));

  // 4.4
  const isFormValid =
    form.firstName.trim().length >= 2 && form.email.includes('@');

  const saveForm = () => {
    const email = form.email.trim().toLowerCase();
    if (items.some(i => i.text.toLowerCase().includes(email))) {
      setFormError('Diese E-Mail ist bereits in der Liste.');
      return;
    }
    addItem(`${form.firstName.trim()} ${form.lastName.trim()} — ${email}`);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  return (
    <View style={styles.container}>
      <LabeledInput
        label="Vorname"
        value={form.firstName}
        onChangeText={value => updateField('firstName', value)}
      />
      <LabeledInput
        label="Nachname"
        value={form.lastName}
        onChangeText={value => updateField('lastName', value)}
      />
      <LabeledInput
        label="E-Mail"
        value={form.email}
        onChangeText={value => updateField('email', value)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <LabeledInput
        label="Notiz"
        value={form.note}
        onChangeText={value => updateField('note', value)}
        multiline
        numberOfLines={3}
      />
      {formError ? <Text style={styles.error}>{formError}</Text> : null}

      <View style={styles.buttons}>
        <Button title="Speichern" onPress={saveForm} disabled={!isFormValid} />
        <Button title="Alles löschen" onPress={() => setForm(EMPTY_FORM)} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Neuer Eintrag (Enter zum Hinzufügen)"
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={submitDraft}   // Return-Taste
        returnKeyType="done"
      />
      <Button title="Hinzufügen" onPress={submitDraft} />

      <Text style={styles.count}>{items.length} Einträge</Text>
      <FlatList
        data={items}
        keyExtractor={item => item.id}   // stabile ID, kein Index
        renderItem={({item}) => (
          <ListItem item={item} onToggle={toggleItem} onDelete={deleteItem} />
        )}
        ListEmptyComponent={<Text style={styles.hint}>Noch keine Einträge.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, gap: 8},
  field: {gap: 2},
  label: {fontWeight: '600'},
  input: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  multiline: {minHeight: 72, textAlignVertical: 'top', paddingTop: 8},
  buttons: {flexDirection: 'row', gap: 8},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  grow: {flex: 1},
  done: {textDecorationLine: 'line-through', color: '#999'},
  delete: {color: '#c62828', fontSize: 18, paddingHorizontal: 8},
  count: {fontWeight: '600', marginTop: 8},
  hint: {color: '#666'},
  error: {color: '#c62828'},
});
```

## Erklärungen

**Unveränderliche Updates.** React vergleicht den alten und neuen State per Referenz (`Object.is`).

```js
form.firstName = 'Ada';
setForm(form);        // ❌ gleiche Referenz → React sieht "keine Änderung" → kein Re-Render
setForm({...form, firstName: 'Ada'}); // ✅ neues Objekt
items.push(x); setItems(items);       // ❌ gleiches Array
setItems(prev => [...prev, x]);       // ✅ neues Array
```

Deshalb: `map` statt Schleife mit Zuweisung, `filter` statt `splice`, Spread statt `push`.

**Funktionsform `setState(prev => …)`.** Nötig, sobald der neue Wert vom alten abhängt.
Mehrere Updates im selben Event werden gebündelt; `setItems([...items, a]); setItems([...items, b]);`
verliert `a`, weil beide Aufrufe dasselbe (veraltete) `items` lesen. Mit `prev => …` bekommt
jeder Aufruf den jeweils aktuellen Stand.

**Computed property name.** `{...prev, [field]: value}` — die eckigen Klammern werten `field`
als Variable aus. Ohne sie hieße der Schlüssel wörtlich `"field"`.

**Keys.** `keyExtractor` sagt React, welche Zeile welche ist. Mit dem Index als Key
(`keyExtractor={(_, i) => String(i)}`) rutschen nach dem Löschen des ersten Eintrags alle
Indizes hoch: React hält Element 0 für "dasselbe" Element und recycelt dessen internen
Zustand — sichtbar z. B. an falsch gesetzten Häkchen oder Eingaben, die in der falschen
Zeile stehen bleiben. Eine stabile `id` (hier aus `Date.now()`, in echt eher `uuid` oder
eine Server-ID) bindet den Zustand an die Daten.

**State-Objekt vs. mehrere States.**

| | Objekt-State | Mehrere `useState` |
|---|---|---|
| Vorteil | eine Änderungsfunktion, leicht zurückzusetzen/abzusenden | unabhängig, keine Spread-Fehler möglich |
| Nachteil | Spread beim Update nötig, sonst Datenverlust | viele Zeilen, Reset ist mühsam |

Faustregel: Werte, die **zusammen** entstehen und **zusammen** abgesendet werden, gehören ins Objekt.

**Architektur.** `App` hält den State und die Logik ("Container"), `LabeledInput` und `ListItem`
stellen nur dar ("Präsentation"). Diese Trennung macht die Kindkomponenten testbar und
wiederverwendbar — sie funktionieren in jedem Kontext, der die passenden Props liefert.
