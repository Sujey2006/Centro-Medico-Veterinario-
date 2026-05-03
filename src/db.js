import sqliteService from './services/sqliteService';

export const initDB = async () => {
  return await sqliteService.initDB();
};

export const getAppointments = async () => {
  return await sqliteService.getAllAsync('SELECT * FROM appointments ORDER BY appointment_date ASC');
};

export const addAppointment = async (pet, owner, service, date) => {
  return await sqliteService.runAsync(
    'INSERT INTO appointments (pet_name, owner_name, service, appointment_date) VALUES (?, ?, ?, ?)',
    [pet, owner, service, date]
  );
};

export const updateAppointment = async (id, pet, owner, service, date, status) => {
  return await sqliteService.runAsync(
    'UPDATE appointments SET pet_name = ?, owner_name = ?, service = ?, appointment_date = ?, status = ? WHERE id = ?',
    [pet, owner, service, date, status, id]
  );
};

export const deleteAppointment = async (id) => {
  return await sqliteService.runAsync('DELETE FROM appointments WHERE id = ?', [id]);
};

export const getPatients = async () => {
  return await sqliteService.getAllAsync('SELECT * FROM patients ORDER BY name ASC');
};

export const addPatient = async (name, species, breed, age, owner_name, owner_phone) => {
  return await sqliteService.runAsync(
    'INSERT INTO patients (name, species, breed, age, owner_name, owner_phone) VALUES (?, ?, ?, ?, ?, ?)',
    [name, species, breed, age, owner_name, owner_phone]
  );
};
