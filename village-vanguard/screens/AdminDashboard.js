import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';

const segments = [
  { id: '1', name: 'Northside Segment', activeTasks: 12 },
  { id: '2', name: 'Southside Segment', activeTasks: 8 },
];

const verifications = [
  { id: '1', name: 'Marcus D.', status: 'Pending Review' },
];

const alerts = [
  { id: '1', type: 'No-Show Flag', detail: 'Task #492 - Volunteer Unreachable' },
];

export default function AdminDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Geographic Segments</Text>
          {segments.map(seg => (
            <View key={seg.id} style={styles.card}>
              <View>
                <Text style={styles.cardTitle}>{seg.name}</Text>
                <Text style={styles.cardDetail}>{seg.activeTasks} Active Tasks</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Verifications</Text>
          {verifications.map(ver => (
            <View key={ver.id} style={[styles.card, styles.highlightCard]}>
              <Text style={styles.cardTitle}>{ver.name}</Text>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>Approve</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#FF3B30' }]}>Alerts</Text>
          {alerts.map(alert => (
            <View key={alert.id} style={[styles.card, styles.alertCard]}>
              <View>
                <Text style={styles.cardTitle}>{alert.type}</Text>
                <Text style={styles.cardDetail}>{alert.detail}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0C10',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A0B2E',
  },
  sectionTitle: {
    color: '#E5A93C',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#1A0B2E',
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  highlightCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#00E5FF',
  },
  alertCard: {
    backgroundColor: '#2A0B1E',
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cardDetail: {
    color: '#A0A0A0',
    fontSize: 14,
    marginTop: 4,
  },
  actionButton: {
    backgroundColor: '#00E5FF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  actionText: {
    color: '#0B0C10',
    fontWeight: 'bold',
  },
});
