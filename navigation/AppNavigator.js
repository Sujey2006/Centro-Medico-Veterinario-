import React, { createContext, useContext, useEffect, useState } from 'react';
import { Image, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from "firebase/auth";
import "firebase/auth"
import { auth } from '../src/services/firebaseService';

import SplashScreen from '../src/screens/SplashScreen';
import RegisterScreen from '../src/screens/auth/RegisterScreen';
import LoginScreen from '../src/screens/auth/LoginScreen';
import HomeScreen from '../src/screens/HomeScreen';
import UserScreen from '../src/screens/UserScreen';
import SettingsScreen from '../src/screens/SettingsScreen';
import CreateAppointmentScreen from '../src/screens/CreateAppointmentScreen';
import EditAppointmentScreen from '../src/screens/EditAppointmentScreen';

// Placeholder screens for Patients (to be created)
import PatientsScreen from '../src/screens/PatientsScreen';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
    const { user } = useAuth();

    return(
        <Tab.Navigator 
            initialRouteName="Home" 
            screenOptions={({route})=>({
                tabBarIcon: ({color, size, focused})=>{
                    let iconName;

                    if (route.name === "Home") {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if(route.name === "Patients"){
                        iconName = focused ? 'paw' : 'paw-outline';
                    } else if(route.name === "User"){
                        if (user?.photoURL) {
                            return (
                                <Image
                                    source={{ uri: user.photoURL }}
                                    style={{
                                        width: size,
                                        height: size,
                                        borderRadius: size / 2,
                                        borderWidth: focused ? 2 : 0,
                                        borderColor: focused ? '#6c5ce7' : 'transparent',
                                    }}
                                />
                            );
                        }
                        return <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />;
                    } else if(route.name === "Settings"){
                        iconName = focused ? 'settings' : 'settings-outline';
                    }
                    
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#6c5ce7',
                tabBarInactiveTintColor: 'gray',
                headerShown: true,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{tabBarLabel:'Citas', title: 'Citas Veterinarias'}}/>
            <Tab.Screen name="Patients" component={PatientsScreen} options={{tabBarLabel:'Pacientes', title: 'Gestión de Pacientes'}}/>
            <Tab.Screen name="User" component={UserScreen} options={{tabBarLabel:'Perfil', title: 'Mi Perfil'}}/>
            <Tab.Screen name="Settings" component={SettingsScreen} options={{tabBarLabel:'Ajustes', title: 'Configuración'}}/>
        </Tab.Navigator>
    )
}   

const AppNavigator = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // En un entorno real usaríamos onAuthStateChanged.
        // Para simplificar esta demo de Centro Veterinario, podemos simular un login o dejarlo abierto.
        const unsuscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });
        return () => unsuscribe();
    },[]);

    const authContextValue = {
        user,
        setUser,
        isLoading,
        setIsLoading,
    };

    if(isLoading){
        return <SplashScreen/>;
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            <Stack.Navigator initialRouteName={user ? 'Main' : 'Login'}>
                {user ? (
                    <>
                        <Stack.Screen name="Main" component={TabNavigator} options={{headerShown: false}} />
                        <Stack.Screen name="Create" component={CreateAppointmentScreen} options={{ title: 'Nueva Cita' }} />
                        <Stack.Screen name="Edit" component={EditAppointmentScreen} options={{ title: 'Editar Cita' }} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
                        <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}} />
                    </>
                )}
            </Stack.Navigator>
        </AuthContext.Provider>   
    );
}

export default AppNavigator;