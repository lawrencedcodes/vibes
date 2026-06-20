import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import SeniorDashboard from './screens/SeniorDashboard';
import ProxyDashboard from './screens/ProxyDashboard';
import VolunteerDashboard from './screens/VolunteerDashboard';
import AdminDashboard from './screens/AdminDashboard';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Elder') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Proxy') {
                iconName = focused ? 'people' : 'people-outline';
              } else if (route.name === 'Volunteer') {
                iconName = focused ? 'flash' : 'flash-outline';
              } else if (route.name === 'Admin') {
                iconName = focused ? 'shield' : 'shield-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarStyle: {
              backgroundColor: '#1A0B2E',
              borderTopColor: '#6B00FF',
              borderTopWidth: 2,
              paddingBottom: 5,
              height: 60,
            },
            tabBarActiveTintColor: '#00E5FF', // Kinetic Teal
            tabBarInactiveTintColor: '#A0A0A0',
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: 'bold',
            }
          })}
        >
          <Tab.Screen name="Elder" component={SeniorDashboard} />
          <Tab.Screen name="Proxy" component={ProxyDashboard} />
          <Tab.Screen name="Volunteer" component={VolunteerDashboard} />
          <Tab.Screen name="Admin" component={AdminDashboard} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
