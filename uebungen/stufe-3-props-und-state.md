# Stufe 3 — Props **und** State kombinieren

**Lernziele:** wiederverwendbare Komponenten mit klarer Prop-Schnittstelle · Callback-Props · *Lifting State Up* · Validierung über Props.

**Voraussetzung:** [Stufe 2](stufe-2-state.md).

---

## Aufgabe 3.1 — Wiederverwendbare Komponente `LabeledInput`

Aus Stufe 2 stehen zwei fast identische Eingabefelder im Code. Zieh sie in eine eigene Komponente.

**Akzeptanzkriterien**

- [ ] `LabeledInput` akzeptiert die Props: `label`, `value`, `onChangeText`, `placeholder` (optional), `maxLength` (optional).
- [ ] Die Komponente rendert Label, Eingabefeld und (falls `maxLength` gesetzt) den Zähler `x / max`.
- [ ] `LabeledInput` enthält **kein eigenes `useState`** für den Text — der Wert kommt von außen.
- [ ] In `App` werden zwei `LabeledInput` verwendet; die States liegen weiterhin in `App`.

```jsx
<LabeledInput
  label="Vorname"
  value={firstName}
  onChangeText={setFirstName}
  placeholder="z. B. Ada"
  maxLength={20}
/>
```

<details><summary>Hinweis</summary>

Das ist das **kontrollierte-Komponenten-Muster**: Die Kindkomponente ist "dumm" (nur Darstellung),
den State hält die Elternkomponente. `onChangeText` ist eine **Funktion als Prop** — Props können
jeden JS-Wert enthalten, auch Funktionen.
</details>

---

## Aufgabe 3.2 — Lifting State Up

Zwei Geschwisterkomponenten sollen denselben Text sehen:

- `NameInput` — Eingabefeld
- `NamePreview` — zeigt `Hallo, <Name>!` und die Zeichenanzahl

**Akzeptanzkriterien**

- [ ] Der State `name` liegt in der **gemeinsamen Elternkomponente** `App`, nicht in `NameInput`.
- [ ] `NameInput` bekommt `value` und `onChangeText` als Props.
- [ ] `NamePreview` bekommt nur `name` als Prop und hat **keinen** State.
- [ ] Tippen im Feld aktualisiert die Vorschau sofort.
- [ ] Zeichne (Skizze im Code-Kommentar oder auf Papier) den Datenfluss: Wo lebt der State, wohin fließen Props, wohin fließt das Event?

<details><summary>Hinweis</summary>

Regel: Brauchen zwei Komponenten dieselben Daten, wandert der State zum **nächsten gemeinsamen Vorfahren**.
Daten fließen **nach unten** (Props), Ereignisse **nach oben** (Callback-Props).

```jsx
function App() {
  const [name, setName] = useState('');
  return (
    <>
      <NameInput value={name} onChangeText={setName} />
      <NamePreview name={name} />
    </>
  );
}
```
</details>

---

## Aufgabe 3.3 — Validierung als Prop-Funktion

Erweitere `LabeledInput` um Validierung.

**Akzeptanzkriterien**

- [ ] Neue Prop `validate`: eine Funktion `(value) => string | null` — `null` bedeutet "gültig", ein String ist die Fehlermeldung.
- [ ] Ist ein Fehler vorhanden, wird er in Rot unter dem Feld angezeigt und der Rahmen ist rot.
- [ ] Ohne `validate`-Prop verhält sich die Komponente wie vorher (kein Fehler, kein Absturz).
- [ ] In `App`: Feld "E-Mail" muss ein `@` enthalten, Feld "Vorname" mindestens 2 Zeichen.
- [ ] Die Fehlermeldung erscheint **nicht** solange das Feld noch nie berührt wurde (leeres Formular sieht nicht "kaputt" aus).

<details><summary>Hinweis</summary>

Für das letzte Kriterium braucht `LabeledInput` doch einen kleinen eigenen State — aber nur für
**UI-Zustand**, nicht für den Wert:

```jsx
const [touched, setTouched] = useState(false);
// ...
<TextInput onBlur={() => setTouched(true)} … />
const error = validate ? validate(value) : null;
const showError = touched && error !== null;
```

Das ist die wichtige Unterscheidung: *Wem gehört welcher State?*
Der Textwert gehört dem Formular (Eltern), "wurde das Feld schon angefasst?" gehört dem Feld selbst.
</details>

---

## Aufgabe 3.4 — `children` und Komposition (optional)

**Akzeptanzkriterien**

- [ ] Baue eine Komponente `Card`, die beliebigen Inhalt über die Prop `children` umrahmt (Titel per Prop `title`).
- [ ] Die Formularfelder aus 3.3 stehen in einer `<Card title="Registrierung">…</Card>`.
- [ ] `Card` weiß nichts über Formulare — sie ist beliebig wiederverwendbar.

---

## Reflexionsfragen

1. Warum darf `LabeledInput` den Text nicht selbst im State halten, wenn `App` ihn braucht?
2. Was ist der Unterschied zwischen der Prop `value` und der Prop `onChangeText` in Bezug auf die Flussrichtung?
3. Wann gehört State in die Kindkomponente, wann nach oben? Nenne je ein Beispiel aus dieser Übung.
4. Was passiert, wenn du `validate` als Prop vergisst — und wie hast du das abgesichert?

➡️ Weiter mit [Stufe 4](stufe-4-formular-und-liste.md) · Lösung: [loesungen/stufe-3.md](../loesungen/stufe-3.md)
