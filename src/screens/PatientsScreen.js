import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getPatients } from '../db';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function PatientsScreen({ navigation }) {
  const [patients, setPatients] = useState([]);
  const isFocused = useIsFocused();

  const loadPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error("Error loading patients:", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadPatients();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="paw" size={24} color="#6c5ce7" />
        <Text style={styles.patientName}>{item.name}</Text>
      </View>
      <Text style={styles.details}>Especie: {item.species} - {item.breed}</Text>
      <Text style={styles.details}>Edad: {item.age} años</Text>
      <Text style={styles.details}>Dueño: {item.owner_name}</Text>
      <Text style={styles.details}>Tel: {item.owner_phone}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No hay pacientes registrados.</Text>}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => Alert.alert("Funcionalidad", "Formulario de registro de pacientes en desarrollo")}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 10 },
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  patientName: { fontSize: 20, fontWeight: 'bold', color: '#2d3436' },
  details: { color: '#636e72', marginBottom: 2 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6c5ce7',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
  empty: { textAlign: 'center', marginTop: 50, color: '#b2bec3' }
});
