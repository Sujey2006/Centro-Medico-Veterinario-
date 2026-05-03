import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAppointments, deleteAppointment } from '../db';
import { useIsFocused } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const isFocused = useIsFocused();

  const loadData = async () => {
    const data = await getAppointments();
    setAppointments(data);
  };

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Cita',
      '¿Estás seguro de que deseas eliminar esta cita?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteAppointment(id);
            loadData();
          }
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.petName}>{item.pet_name}</Text>
        <Text style={[styles.status, { backgroundColor: item.status === 'Completed' ? '#d1f7d1' : '#e0e0ff' }]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.details}>Dueño: {item.owner_name}</Text>
      <Text style={styles.details}>Servicio: {item.service}</Text>
      <Text style={styles.details}>Fecha: {item.appointment_date}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('Edit', { appointment: item })}
        >
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.btnText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Create')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={<Text style={styles.empty}>No hay citas programadas.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 10 },
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  petName: { fontSize: 20, fontWeight: 'bold', color: '#6c5ce7' },
  status: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, fontSize: 12, overflow: 'hidden' },
  details: { color: '#636e72', marginBottom: 2 },
  actions: { flexDirection: 'row', marginTop: 15, gap: 10 },
  editBtn: { flex: 1, backgroundColor: '#a29bfe', padding: 10, borderRadius: 8, alignItems: 'center' },
  deleteBtn: { flex: 1, backgroundColor: '#ff7675', padding: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#6c5ce7', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5, zIndex: 1 },
  fabText: { color: '#fff', fontSize: 30, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, color: '#b2bec3' }
});
