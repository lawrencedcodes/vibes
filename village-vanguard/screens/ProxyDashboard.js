import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';

const initialTasks = [
  { id: '1', title: 'Pick up prescriptions', isCritical: true, status: 'Pending' },
  { id: '2', title: 'Mow the lawn', isCritical: false, status: 'Scheduled' },
];

export default function ProxyDashboard() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleCritical = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, isCritical: !t.isCritical } : t));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Proxy Dashboard</Text>
        <Text style={styles.subtitle}>Managing Elder Profile</Text>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, item.isCritical && styles.criticalCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskStatus}>{item.status}</Text>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.criticalText}>CRITICAL</Text>
              <Switch
                value={item.isCritical}
                onValueChange={() => toggleCritical(item.id)}
                trackColor={{ false: '#444', true: '#FF3B30' }}
                thumbColor={item.isCritical ? '#E5A93C' : '#f4f3f4'}
              />
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+ New Task</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0C10',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#6B00FF',
  },
  headerTitle: {
    color: '#6B00FF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#00E5FF',
    fontSize: 16,
    marginTop: 5,
  },
  list: {
    padding: 20,
  },
  card: {
    backgroundColor: '#1A0B2E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  criticalCard: {
    borderColor: '#FF3B30',
    backgroundColor: '#2A0B1E',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  taskTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  taskStatus: {
    color: '#00E5FF',
    fontSize: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  criticalText: {
    color: '#E5A93C',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#6B00FF',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    elevation: 5,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
