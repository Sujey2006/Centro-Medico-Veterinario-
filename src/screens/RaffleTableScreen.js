import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native'
import { useRoute } from '@react-navigation/native'
import sqliteService from '../services/sqliteService'
import colors from '../constants/colors'

const RaffleTableScreen = () => {
  const [boletos, setBoletos] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedNumero, setSelectedNumero] = useState(null)
  const [selectedBoleto, setSelectedBoleto] = useState(null)
  const [nombre, setNombre] = useState('')
  const [estadoPago, setEstadoPago] = useState('pendiente')
  const route = useRoute()
  const { sorteoId } = route.params

  useEffect(() => {
    loadBoletos()
  }, [sorteoId])

  const loadBoletos = async () => {
    const data = await sqliteService.obtenerBoletosPorSorteo(sorteoId)
    setBoletos(data)
  }

  const getBoletoByNumero = (numero) => {
    return boletos.find(b => b.numero === numero)
  }

  const handleEdit = (numero) => {
    const boleto = getBoletoByNumero(numero)
    setSelectedNumero(numero)
    setSelectedBoleto(boleto)
    setNombre(boleto ? boleto.nombre_participante || '' : '')
    setEstadoPago(boleto ? boleto.estado_pago || 'pendiente' : 'pendiente')
    setModalVisible(true)
  }

  const handleSave = async () => {
    if (selectedBoleto) {
      const success = await sqliteService.actualizarBoleto(selectedBoleto.id, nombre, estadoPago)
      if (success) {
        Alert.alert('Éxito', 'Boleto actualizado')
        loadBoletos()
      } else {
        Alert.alert('Error', 'No se pudo actualizar')
      }
    } else {
      // Crear boleto si no existe
      const id = await sqliteService.comprarBoleto(sorteoId, '', selectedNumero)
      if (id) {
        await sqliteService.actualizarBoleto(id, nombre, estadoPago)
        Alert.alert('Éxito', 'Boleto creado')
        loadBoletos()
      } else {
        Alert.alert('Error', 'No se pudo crear boleto')
      }
    }
    setModalVisible(false)
  }

  const renderRow = (start) => {
    const cells = []
    for (let i = 0; i < 10; i++) {
      const numero = start + i
      const boleto = getBoletoByNumero(numero)
      cells.push(
        <TouchableOpacity key={numero} style={styles.cell} onPress={() => handleEdit(numero)}>
          <Text style={styles.numero}>{numero.toString().padStart(2, '0')}</Text>
          {boleto && (
            <>
              <Text style={styles.nombre}>{boleto.nombre_participante || 'Sin nombre'}</Text>
              <Text style={[styles.estado, boleto.estado_pago === 'pagado' ? styles.pagado : styles.pendiente]}>
                {boleto.estado_pago}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )
    }
    return <View style={styles.row}>{cells}</View>
  }

  const rows = []
  for (let i = 0; i < 100; i += 10) {
    rows.push(renderRow(i))
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tabla de Números (00-99)</Text>
      <View style={styles.table}>
        {rows}
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Número {selectedNumero?.toString().padStart(2, '0')}</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del participante"
              value={nombre}
              onChangeText={setNombre}
            />
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setEstadoPago(estadoPago === 'pagado' ? 'pendiente' : 'pagado')}
            >
              <Text>Estado: {estadoPago}</Text>
            </TouchableOpacity>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.principal,
    padding: 10,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  cell: {
    width: 30,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  numero: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  nombre: {
    fontSize: 8,
    textAlign: 'center',
  },
  estado: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  pagado: {
    color: 'green',
  },
  pendiente: {
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
})

export default RaffleTableScreen