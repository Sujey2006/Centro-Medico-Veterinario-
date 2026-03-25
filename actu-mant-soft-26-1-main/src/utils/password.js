const crypto = require('crypto');

const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH_BYTES = 32;

function createSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function hashPassword(password, salt) {
  // PBKDF2 => protege contra ataques de diccionario y rainbow tables.
  return crypto
    .pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH_BYTES, 'sha256')
    .toString('hex');
}

function verifyPassword(password, salt, passwordHash) {
  const hashToCheck = hashPassword(password, salt);
  // timingSafeEqual evita filtrar información por tiempos.
  return crypto.timingSafeEqual(Buffer.from(hashToCheck), Buffer.from(passwordHash));
}

module.exports = {
  createSalt,
  hashPassword,
  verifyPassword,
};

