const db = require('../config/db');

// SQL centralizado para la entidad "appointments".
const SQL_GET_ALL_APPOINTMENTS =
  'SELECT * FROM appointments ORDER BY appointment_date DESC';
const SQL_GET_APPOINTMENT_BY_ID =
  'SELECT * FROM appointments WHERE id = ?';
const SQL_INSERT_APPOINTMENT =
  'INSERT INTO appointments (pet_name, owner_name, service, appointment_date) VALUES (?, ?, ?, ?)';
const SQL_UPDATE_APPOINTMENT =
  'UPDATE appointments SET pet_name = ?, owner_name = ?, service = ?, appointment_date = ?, status = ? WHERE id = ?';
const SQL_DELETE_APPOINTMENT = 'DELETE FROM appointments WHERE id = ?';

function getAllAppointments() {
  return new Promise((resolve, reject) => {
    db.all(SQL_GET_ALL_APPOINTMENTS, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function getAppointmentById(id) {
  return new Promise((resolve, reject) => {
    db.get(SQL_GET_APPOINTMENT_BY_ID, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
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

function updateAppointment(id, { pet_name, owner_name, service, appointment_date, status }) {
  const params = [pet_name, owner_name, service, appointment_date, status, id];
  return new Promise((resolve, reject) => {
    db.run(SQL_UPDATE_APPOINTMENT, params, function (err) {
      if (err) return reject(err);
      resolve({ changes: this.changes });
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
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
