'use strict';

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Linking, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const WEB_APP_URL = 'https://auralia-metapet.com';
const DOCS_URL = 'https://docs.expo.dev/';

export default function App() {
  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      // best-effort; no-op if device cannot open
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Auralia MetaPet</Text>
          <Text style={styles.subtitle}>Expo dev shell</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Getting started</Text>
          <Text style={styles.body}>
            This is a minimal Expo entrypoint so the Android build and Metro bundler can run. Use the buttons below to open the
            web experience or Expo docs while mobile features are under construction.
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={() => openLink(WEB_APP_URL)}>
              <Text style={styles.buttonText}>Open Web App</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.secondary]} onPress={() => openLink(DOCS_URL)}>
              <Text style={styles.buttonText}>Expo Docs</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.meta}>Platform: {Platform.OS}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Next steps</Text>
          <Text style={styles.body}>Replace this screen with your React Native UI once the shared logic is ready.</Text>
          <Text style={styles.body}>When iterating, run `npm run android` (physical/emulator) or `npm run ios` (simulator).</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    padding: 24,
    gap: 16,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 28,
    color: '#f8fafc',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5e1',
  },
  card: {
    backgroundColor: '#111827',
    borderColor: '#1f2937',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    color: '#e2e8f0',
    fontWeight: '600',
  },
  body: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: '#334155',
  },
  buttonText: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
  meta: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 8,
  },
});
