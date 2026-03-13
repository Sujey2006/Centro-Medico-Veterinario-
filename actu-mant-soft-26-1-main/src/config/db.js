<<<<<<< HEAD
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

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

    const stmt = db.prepare("INSERT INTO appointments (pet_name, owner_name, service, appointment_date) VALUES (?, ?, ?, ?)");
    stmt.run("Rex", "Juan Pérez", "Corte de Pelo", "2026-02-25 10:00");
    stmt.run("Luna", "Maria García", "Baño y Limpieza", "2026-02-25 11:30");
    stmt.finalize();
});

module.exports = db;
=======
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

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
});

module.exports = db;
>>>>>>> 0cffe9f33155ef4f0ecd21ecfc624089b2682cbc
