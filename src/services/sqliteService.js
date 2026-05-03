import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

let db = null;

const initDB = async () => {
  if (db) return db;

  // En Web, expo-sqlite usa una implementación basada en memoria o IndexedDB si está disponible
  // pero requiere configuraciones adicionales de WASM en algunos casos.
  // Para compatibilidad máxima en esta demo web, manejamos el error elegantemente.
  try {
    db = await SQLite.openDatabaseAsync('veterinaria.db');
    console.log('Base de datos veterinaria abierta correctamente');

    await db.execAsync(`
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pet_name TEXT NOT NULL,
        owner_name TEXT NOT NULL,
        service TEXT NOT NULL,
        appointment_date TEXT NOT NULL,
        status TEXT DEFAULT 'Scheduled'
      );
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        species TEXT NOT NULL,
        breed TEXT,
        age INTEGER,
        owner_name TEXT NOT NULL,
        owner_phone TEXT
      );
      CREATE TABLE IF NOT EXISTS medical_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        diagnosis TEXT,
        treatment TEXT,
        FOREIGN KEY (patient_id) REFERENCES patients (id)
      );
    `);
  } catch (error) {
    console.error("Error al inicializar SQLite:", error);
    // Si estamos en web y falla, podemos crear un mock para evitar que la app explote
    if (Platform.OS === 'web') {
      db = {
        execAsync: async () => {},
        runAsync: async () => ({ lastInsertRowId: Date.now() }),
        getAllAsync: async () => [],
        getFirstAsync: async () => null,
      };
    }
  }

  return db;
};

const ensureDB = async () => {
  if (!db) {
    await initDB();
  }
  return db;
};

export default {
  initDB,
  ensureDB,
  // Métodos auxiliares para facilitar el uso en los componentes
  runAsync: async (query, params) => {
    const database = await ensureDB();
    return database.runAsync(query, params);
  },
  getAllAsync: async (query, params) => {
    const database = await ensureDB();
    return database.getAllAsync(query, params);
  },
  getFirstAsync: async (query, params) => {
    const database = await ensureDB();
    return database.getFirstAsync(query, params);
  }
};
