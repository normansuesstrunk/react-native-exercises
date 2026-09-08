import React, { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

// Eine eigene Komponente für eine Zeile: bekommt den Text als Prop (Stufe 1)
// und kümmert sich nur ums Aussehen eines einzelnen Eintrags.
function Item({ title }: { title: string }) {
  return <Text style={styles.item}>{title}</Text>;
}

export default function App() {
  const [text, setText] = useState('');   // Inhalt des Eingabefelds
  const [items, setItems] = useState<string[]>([]); // die Liste — noch leer

  const addItem = () => {
    setItems(prev => [...prev, text]);
    setText(''); // Eingabefeld leeren
  };

  return (
    <View style={styles.container}>

      <Text>{text}</Text>

      <Text style={styles.title}>Einkaufsliste</Text>
      <TextInput
        style={styles.input}
        placeholder="Was soll auf die Liste?"
        value={text}
        onChangeText={setText}
      />
      <Button title="Hinzufügen" onPress={addItem} />

      {/* 2b.3 mit FlatList: `data` ist das Array, `renderItem` bekommt pro
          Eintrag ein Objekt und gibt das JSX dafür zurück. Die Liste scrollt
          von selbst und rendert nur die sichtbaren Zeilen. */}
      <FlatList
        data={items}

        renderItem={({ item }) => <Item title={item} />}
        keyExtractor={(item, index) => String(index)}
        // Anzahl ist berechnet, nicht im State. Bei leerer Liste kein Header,
        // sonst stünde "0 Einträge" über dem Hinweis.
        ListHeaderComponent={
          items.length > 0
            ? <Text style={styles.count}>{items.length} Einträge</Text>
            : null
        }
        ListEmptyComponent={<Text style={styles.hint}>Noch nichts auf der Liste.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: '600' },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  item: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  count: { fontWeight: '600' },
  hint: { color: '#666', fontStyle: 'italic' },
});