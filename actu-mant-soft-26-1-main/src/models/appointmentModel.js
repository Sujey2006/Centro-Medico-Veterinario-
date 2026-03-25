const db = require('../config/db');

// SQL centralizado para la entidad "appointments".
const SQL_GET_ALL_APPOINTMENTS =
  'SELECT * FROM appointments ORDER BY appointment_date DESC';
const SQL_INSERT_APPOINTMENT =
  'INSERT INTO appointments (pet_name, owner_name, service, appointment_date) VALUES (?, ?, ?, ?)';
const SQL_DELETE_APPOINTMENT = 'DELETE FROM appointments WHERE id = ?';

function getAllAppointments() {
  return new Promise((resolve, reject) => {
    db.all(SQL_GET_ALL_APPOINTMENTS, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function createAppointment({ pet_name, owner_name, service, appointment_date }) {
  const params = [pet_name, owner_name, service, appointment_date];
  return new Promise((resolve, reject) => {
    db.run(SQL_INSERT_APPOINTMENT, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  });
}

function deleteAppointment(id) {
  return new Promise((resolve, reject) => {
    db.run(SQL_DELETE_APPOINTMENT, [id], function (err) {
      if (err) return reject(err);
      resolve({ changes: this.changes });
    });
  });
}

module.exports = {
  getAllAppointments,
  createAppointment,
  deleteAppointment,
};

