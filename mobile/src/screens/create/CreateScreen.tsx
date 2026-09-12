import { View, Text, StyleSheet } from 'react-native'

// Phase 2 mein build hoga — user question creation form
export default function CreateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create Question — Phase 2</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 16, color: '#888' },
})
