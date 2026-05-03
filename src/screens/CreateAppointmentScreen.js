import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { addAppointment } from '../db';

export default function CreateAppointmentScreen({ navigation }) {
  const [petName, setPetName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');

  const handleCreate = async () => {
    if (!petName || !ownerName || !service || !date) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    await addAppointment(petName, ownerName, service, date);
    Alert.alert('Éxito', 'Cita programada correctamente');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Nombre del Perrito</Text>
        <TextInput style={styles.input} value={petName} onChangeText={setPetName} placeholder="Ej: Toby" />

        <Text style={styles.label}>Nombre del Dueño</Text>
        <TextInput style={styles.input} value={ownerName} onChangeText={setOwnerName} placeholder="Ej: Carlos Ruiz" />

        <Text style={styles.label}>Servicio</Text>
        <TextInput style={styles.input} value={service} onChangeText={setService} placeholder="Ej: Corte de Pelo" />

        <Text style={styles.label}>Fecha y Hora</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2026-02-25 10:00" />

        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Programar Cita</Text>
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
  button: { backgroundColor: '#6c5ce7', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
