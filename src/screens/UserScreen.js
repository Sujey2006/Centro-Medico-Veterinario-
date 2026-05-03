import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../services/firebaseService';
import { signOut } from 'firebase/auth';
import { getAppointments, getPatients } from '../db';
import { useIsFocused } from '@react-navigation/native';

const UserScreen = () => {
    const { user } = useAuth();
    const isFocused = useIsFocused();
    const [stats, setStats] = useState({ appointments: 0, patients: 0 });

    useEffect(() => {
        if (isFocused) {
            loadStats();
        }
    }, [isFocused]);

    const loadStats = async () => {
        try {
            const apps = await getAppointments();
            const pats = await getPatients();
            // Filtrar citas de hoy
            const today = new Date().toISOString().split('T')[0];
            const todayApps = apps.filter(a => a.appointment_date.includes(today));

            setStats({
                appointments: todayApps.length,
                patients: pats.length
            });
        } catch (error) {
            console.error("Error cargando estadísticas:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileImageContainer}>
                    {user?.photoURL ? (
                        <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
                    ) : (
                        <Ionicons name="person-circle" size={100} color="#6c5ce7" />
                    )}
                </View>
                <Text style={styles.userName}>{user?.displayName || 'Dr. Veterinario'}</Text>
                <Text style={styles.userEmail}>{user?.email || 'admin@vetcare.com'}</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Resumen del Centro</Text>
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.appointments}</Text>
                        <Text style={styles.statLabel}>Citas hoy</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.patients}</Text>
                        <Text style={styles.statLabel}>Pacientes</Text>
                    </View>
                </View>
            </View>

            <View style={styles.actionsSection}>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="medical-outline" size={24} color="#6c5ce7" />
                    <Text style={styles.actionText}>Historial Clínico</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="settings-outline" size={24} color="#6c5ce7" />
                    <Text style={styles.actionText}>Configuración</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#ff7675" />
                    <Text style={[styles.actionText, styles.logoutText]}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { alignItems: 'center', padding: 30, backgroundColor: '#fff', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 3 },
    profileImageContainer: { marginBottom: 15 },
    profileImage: { width: 100, height: 100, borderRadius: 50 },
    userName: { fontSize: 24, fontWeight: 'bold', color: '#2d3436' },
    userEmail: { fontSize: 16, color: '#636e72', marginTop: 5 },
    infoSection: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2d3436', marginBottom: 15 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    statCard: { backgroundColor: '#fff', flex: 1, marginHorizontal: 5, padding: 15, borderRadius: 15, alignItems: 'center', elevation: 2 },
    statNumber: { fontSize: 22, fontWeight: 'bold', color: '#6c5ce7' },
    statLabel: { fontSize: 14, color: '#636e72', marginTop: 5 },
    actionsSection: { padding: 20 },
    actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 1 },
    actionText: { fontSize: 16, marginLeft: 15, color: '#2d3436' },
    logoutButton: { marginTop: 10 },
    logoutText: { color: '#ff7675' }
});

export default UserScreen;
