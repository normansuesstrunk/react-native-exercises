import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';

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
  container: { flex: 1, padding: 24, gap: 12 },
  input: { height: 44, borderWidth: 1, borderColor: '#999', borderRadius: 8, paddingHorizontal: 12 },
  pizza: { fontSize: 36 },
});