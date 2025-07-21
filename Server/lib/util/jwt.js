const jwt = require('jsonwebtoken');
const SECRET_KEY = 'A-very-very-secret-key-that-must-not-be-exposed-or-sumthing';

async function sign(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}


async function verify(token) {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
}


module.exports = {
    sign: sign,
    verify: verify
}