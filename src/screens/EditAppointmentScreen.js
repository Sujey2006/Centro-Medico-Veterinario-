import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { updateAppointment } from '../db';

export default function EditAppointmentScreen({ route, navigation }) {
  const { appointment } = route.params;
  const [petName, setPetName] = useState(appointment.pet_name);
  const [ownerName, setOwnerName] = useState(appointment.owner_name);
  const [service, setService] = useState(appointment.service);
  const [date, setDate] = useState(appointment.appointment_date);
  const [status, setStatus] = useState(appointment.status);

  const handleUpdate = async () => {
    if (!petName || !ownerName || !service || !date) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    await updateAppointment(appointment.id, petName, ownerName, service, date, status);
    Alert.alert('Éxito', 'Cita actualizada correctamente');
    navigation.goBack();
  };

  const statusOptions = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Nombre del Perrito</Text>
        <TextInput style={styles.input} value={petName} onChangeText={setPetName} />

        <Text style={styles.label}>Nombre del Dueño</Text>
        <TextInput style={styles.input} value={ownerName} onChangeText={setOwnerName} />

        <Text style={styles.label}>Servicio</Text>
        <TextInput style={styles.input} value={service} onChangeText={setService} />

        <Text style={styles.label}>Fecha y Hora</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} />

        <Text style={styles.label}>Estado de la Cita</Text>
        <View style={styles.statusContainer}>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.statusBtn, status === option && styles.statusBtnActive]}
              onPress={() => setStatus(option)}
            >
              <Text style={[styles.statusText, status === option && styles.statusTextActive]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Actualizar Cita</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f8f9fa' },
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 20, elevation: 3 },
  label: { fontSize: 16, fontWeight: '600', color: '#2d3436', marginBottom: 8 },
  input: { borderBottomWidth: 1, borderBottomColor: '#6c5ce7', marginBottom: 20, padding: 8, fontSize: 16 },
  statusContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statusBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#a29bfe' },
  statusBtnActive: { backgroundColor: '#6c5ce7', borderColor: '#6c5ce7' },
  statusText: { color: '#6c5ce7', fontSize: 12 },
  statusTextActive: { color: '#fff' },
  button: { backgroundColor: '#6c5ce7', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
