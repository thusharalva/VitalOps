import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ScanScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>QR Code Scanner</Text>
        <Text style={styles.subtitle}>Scan asset QR codes</Text>
        
        <TouchableOpacity style={styles.scanButton}>
          <Text style={styles.scanButtonText}>Open Camera</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Point your camera at the QR code to scan asset details
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
  },
  scanButton: {
    backgroundColor: '#14a2a2',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  note: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    maxWidth: 300,
  },
});



