# Lösung — Stufe 3 (Props + State, Lifting State Up)

```jsx
import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

// 3.4: Komposition über children — weiß nichts über Formulare
const Card = ({title, children}) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

// 3.1 + 3.3: kontrollierte, wiederverwendbare Eingabekomponente.
// Kein State für den WERT (der gehört dem Formular),
// aber State für reinen UI-Zustand (touched).
const LabeledInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  maxLength,
  validate,
}) => {
  const [touched, setTouched] = useState(false);

  const error = validate ? validate(value) : null;
  const showError = touched && error !== null;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, showError && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {maxLength ? (
        <Text style={styles.hint}>
          {value.length} / {maxLength}
        </Text>
      ) : null}
      {showError ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

// 3.2: reine Anzeigekomponente, kein State
const NamePreview = ({name}) => (
  <View>
    <Text style={styles.preview}>
      {name.trim() ? `Hallo, ${name.trim()}!` : 'Noch kein Name eingegeben.'}
    </Text>
    <Text style={styles.hint}>{name.length} Zeichen</Text>
  </View>
);

// Validierungsregeln: einfache, testbare Funktionen außerhalb der Komponente
const requireMinLength = min => value =>
  value.trim().length >= min ? null : `Mindestens ${min} Zeichen.`;

const requireEmail = value =>
  value.includes('@') ? null : 'Die E-Mail muss ein @ enthalten.';

export default function App() {
  // Datenfluss:
  //   App (State: name, email)
  //     ├─ Props (value)      ──▶ LabeledInput / NamePreview
  //     └─ Callback (onChangeText) ◀── Ereignis aus LabeledInput
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <Card title="Registrierung">
        <LabeledInput
          label="Vorname"
          value={name}
          onChangeText={setName}
          placeholder="z. B. Ada"
          maxLength={20}
          validate={requireMinLength(2)}
        />
        <LabeledInput
          label="E-Mail"
          value={email}
          onChangeText={setEmail}
          placeholder="ada@example.com"
          validate={requireEmail}
        />
      </Card>

      <NamePreview name={name} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 24, gap: 16},
  card: {borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 16, gap: 12},
  cardTitle: {fontSize: 18, fontWeight: 'bold'},
  field: {gap: 4},
  label: {fontWeight: '600'},
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputError: {borderColor: '#c62828'},
  error: {color: '#c62828'},
  hint: {color: '#666', fontSize: 12},
  preview: {fontSize: 18},
});
```

## Erklärungen

**Wem gehört welcher State?** Die zentrale Frage dieser Stufe.

| Wert | Ort | Begründung |
|---|---|---|
| `name`, `email` | `App` | Werden von mehreren Komponenten gebraucht (Eingabe *und* Vorschau) und beim Absenden. |
| `touched` | `LabeledInput` | Reiner Darstellungs­zustand eines Feldes; niemand sonst interessiert sich dafür. |

Hätte `LabeledInput` den Textwert selbst gehalten, käme `NamePreview` nicht mehr daran —
Geschwisterkomponenten können nicht aufeinander zugreifen. Deshalb: **State zum nächsten
gemeinsamen Vorfahren hochziehen** (*lifting state up*).

**Flussrichtung.** `value` fließt nach unten (Eltern → Kind), `onChangeText` ist eine
Funktion, die das Kind aufruft, um ein Ereignis nach oben zu melden. Das Kind ändert nichts
selbst, es *bittet* die Eltern um eine Änderung. Daher: einseitiger Datenfluss.

**`validate` als Prop.** Die Regel steckt beim Aufrufer, nicht in der Komponente —
`LabeledInput` bleibt für jede Regel wiederverwendbar. `requireMinLength(2)` ist eine
Funktion, die eine Funktion zurückgibt (Currying), so wird die Regel parametrisierbar.
`validate ? validate(value) : null` sichert die fehlende Prop ab; ohne diese Prüfung
gäbe es `validate is not a function`.

**`{bedingung ? <X/> : null}`** statt `{bedingung && <X/>}`: Bei `&&` mit einer **Zahl**
links (z. B. `value.length && …`) würde React die `0` rendern und ein `0` erscheint auf
dem Bildschirm. Der Ternär-Ausdruck vermeidet diese klassische Falle.
