const db = require('../config/db');

function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id, username, role, password_hash, password_salt FROM users WHERE username = ?',
      [username],
      (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      }
    );
  });
}

function createUser({ username, role, passwordHash, passwordSalt }) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (username, role, password_hash, password_salt) VALUES (?, ?, ?, ?)',
      [username, role, passwordHash, passwordSalt],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
}

module.exports = {
  getUserByUsername,
  createUser,
};

