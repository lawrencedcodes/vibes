import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Modal } from 'react-native';

const availableTasks = [
  { id: '1', type: 'Yard Work', distance: '1.2 miles', time: 'Today, 2:00 PM' },
  { id: '2', type: 'Tech Help', distance: '3.5 miles', time: 'Tomorrow, 10:00 AM' },
];

export default function VolunteerDashboard() {
  const [tasks, setTasks] = useState(availableTasks);
  const [acceptedTask, setAcceptedTask] = useState(null);

  const acceptTask = (task) => {
    setAcceptedTask(task);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trust Score</Text>
        <View style={styles.energyMeterContainer}>
          <View style={styles.energyMeterFill} />
        </View>
        <Text style={styles.scoreText}>98 / 100 ⚡</Text>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.feed}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View>
              <Text style={styles.taskType}>{item.type}</Text>
              <Text style={styles.taskDetails}>{item.distance} • {item.time}</Text>
            </View>
            <TouchableOpacity style={styles.acceptButton} onPress={() => acceptTask(item)}>
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={!!acceptedTask} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Task Accepted!</Text>
            <Text style={styles.modalText}>You are paired with: Buddy James</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setAcceptedTask(null)}>
              <Text style={styles.closeText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0C10',
  },
  header: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#1A0B2E',
    borderBottomWidth: 2,
    borderBottomColor: '#00E5FF',
  },
  headerTitle: {
    color: '#00E5FF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  energyMeterContainer: {
    width: '80%',
    height: 15,
    backgroundColor: '#333',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  energyMeterFill: {
    width: '98%',
    height: '100%',
    backgroundColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  feed: {
    padding: 20,
  },
  taskCard: {
    backgroundColor: '#1A0B2E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskType: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  taskDetails: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  acceptButton: {
    backgroundColor: '#6B00FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  acceptText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(11, 12, 16, 0.8)',
  },
  modalContent: {
    backgroundColor: '#1A0B2E',
    padding: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 2,
    borderTopColor: '#00E5FF',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#00E5FF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#E5A93C',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  closeText: {
    color: '#0B0C10',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
