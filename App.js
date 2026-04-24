import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initDB } from './src/db';
import HomeScreen from './src/screens/HomeScreen';
import EditAppointmentScreen from './src/screens/EditAppointmentScreen';
import CreateAppointmentScreen from './src/screens/CreateAppointmentScreen';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Panel de Citas' }} />
        <Stack.Screen name="Create" component={CreateAppointmentScreen} options={{ title: 'Nueva Cita' }} />
        <Stack.Screen name="Edit" component={EditAppointmentScreen} options={{ title: 'Editar Cita' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
