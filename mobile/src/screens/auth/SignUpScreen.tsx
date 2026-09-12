import { View, Text, StyleSheet } from 'react-native'

// Phase 1 mein build hoga
export default function SignUpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sign Up — Phase 1</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 16, color: '#888' },
})
