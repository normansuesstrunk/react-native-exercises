import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type MyProps = {
  name: string;
};

const Greeting = (p: MyProps) => {
  return <Text style={styles.greeting}>Hallo, {p.name}!</Text>;
};



export default function App() {
  return (
    <View style={styles.container}>
      <Greeting name="Max" />
      <Greeting name="Anna" />
      <Greeting name="Peter" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  greeting: { fontSize: 20 },
});