import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, SafeAreaView } from 'react-native';

const { height } = Dimensions.get('window');
const BUTTON_HEIGHT = height * 0.25;

const options = [
  { id: '1', title: 'Groceries' },
  { id: '2', title: 'Yard Work' },
  { id: '3', title: 'Tech Help' },
  { id: '4', title: 'Call Captain' },
  { id: '5', title: 'Pharmacy' },
  { id: '6', title: 'Meal Delivery' },
  { id: '7', title: 'Transportation' },
  { id: '8', title: 'Companionship' },
];

export default function SeniorDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={options}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0C10', // Deep Obsidian
  },
  button: {
    height: BUTTON_HEIGHT,
    backgroundColor: '#1A0B2E', // Midnight Purple
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#0B0C10', // Separation
  },
  buttonText: {
    color: '#E5A93C', // Ancestral Gold
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
