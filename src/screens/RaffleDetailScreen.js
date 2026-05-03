import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import sqliteService from '../services/sqliteService'
import { useAuth } from '../../navigation/AppNavigator'
import colors from '../constants/colors'

const RaffleDetailScreen = () => {
  const [sorteo, setSorteo] = useState(null)
  const [boletos, setBoletos] = useState([])
  const { user } = useAuth()
  const route = useRoute()
  const navigation = useNavigation()
  const { sorteoId } = route.params

  useEffect(() => {
    loadData()
  }, [sorteoId])

  const loadData = async () => {
    const s = await sqliteService.obtenerSorteoPorId(sorteoId)
    const b = await sqliteService.obtenerBoletosPorSorteo(sorteoId)
    setSorteo(s)
    setBoletos(b)
  }

  const handleBuyTicket = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para comprar boletos')
      return
    }

    // Generar número único
    const existingNumbers = boletos.map(b => b.numero)
    let numero
    do {
      numero = Math.floor(Math.random() * 10000) + 1
    } while (existingNumbers.includes(numero))

    const id = await sqliteService.comprarBoleto(sorteoId, user.email, numero)
    if (id) {
      Alert.alert('Éxito', `Boleto comprado. Tu número es: ${numero}`)
      loadData()
    } else {
      Alert.alert('Error', 'No se pudo comprar el boleto')
    }
  }

  const handleSelectWinner = async () => {
    const numeroGanador = await sqliteService.seleccionarGanador(sorteoId)
    if (numeroGanador) {
      Alert.alert('Ganador', `El número ganador es: ${numeroGanador}`)
      loadData()
    } else {
      Alert.alert('Error', 'No se pudo seleccionar ganador')
    }
  }

  if (!sorteo) return <Text>Cargando...</Text>

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{sorteo.nombre}</Text>
      <Text style={styles.premio}>Premio: {sorteo.premio}</Text>
      <Text style={styles.descripcion}>{sorteo.descripcion}</Text>
      <Text style={styles.fecha}>Hasta: {new Date(sorteo.fecha_fin).toLocaleDateString()}</Text>
      <Text style={styles.precio}>Precio boleto: ${sorteo.precio_boleto}</Text>
      <Text style={styles.estado}>Estado: {sorteo.estado}</Text>

      {sorteo.numero_ganador && (
        <Text style={styles.ganador}>Número ganador: {sorteo.numero_ganador}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleBuyTicket}>
        <Text style={styles.buttonText}>Comprar Boleto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tableButton} onPress={() => navigation.navigate('RaffleTable', { sorteoId })}>
        <Text style={styles.buttonText}>Ver Tabla de Números</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Boletos comprados:</Text>
      <FlatList
        data={boletos}
        renderItem={({ item }) => (
          <View style={styles.boletoItem}>
            <Text>Número: {item.numero}</Text>
            <Text>Usuario: {item.usuario_email}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>No hay boletos</Text>}
      />

      {new Date() > new Date(sorteo.fecha_fin) && sorteo.estado === 'activo' && (
        <TouchableOpacity style={styles.winnerButton} onPress={handleSelectWinner}>
          <Text style={styles.buttonText}>Seleccionar Ganador</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.principal,
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  premio: {
    fontSize: 18,
    color: '#fff',
  },
  descripcion: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 10,
  },
  fecha: {
    fontSize: 16,
    color: '#fff',
  },
  precio: {
    fontSize: 16,
    color: '#fff',
  },
  estado: {
    fontSize: 16,
    color: '#fff',
  },
  ganador: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  tableButton: {
    backgroundColor: '#0077B6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  winnerButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    marginTop: 20,
  },
  boletoItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  empty: {
    textAlign: 'center',
    color: '#fff',
  },
})

export default RaffleDetailScreen