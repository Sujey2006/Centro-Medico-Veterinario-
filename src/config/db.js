const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const { createSalt, hashPassword } = require('../utils/password');

db.serialize(() => {
    db.run(`CREATE TABLE appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pet_name TEXT NOT NULL,
        owner_name TEXT NOT NULL,
        service TEXT NOT NULL,
        appointment_date TEXT NOT NULL,
        status TEXT DEFAULT 'Scheduled',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Add some initial dummy data
    const stmt = db.prepare("INSERT INTO appointments (pet_name, owner_name, service, appointment_date) VALUES (?, ?, ?, ?)");
    stmt.run("Rex", "Juan Pérez", "Corte de Pelo", "2026-02-25 10:00");
    stmt.run("Luna", "Maria García", "Baño y Limpieza", "2026-02-25 11:30");
    stmt.finalize();

    // ===== Sesiones y roles (HU 3) =====
    // Tabla de usuarios para autenticación.
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL
    )`);

    // Usuario demo: veterinario / 1234
    const seedUsername = 'veterinario';
    const seedPassword = '1234';
    const seedSalt = createSalt();
    const seedHash = hashPassword(seedPassword, seedSalt);
    db.run(
      'INSERT INTO users (username, role, password_hash, password_salt) VALUES (?, ?, ?, ?)',
      [seedUsername, 'Veterinario', seedHash, seedSalt]
    );
});

module.exports = db;
