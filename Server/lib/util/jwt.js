const jwt = require('jsonwebtoken');
const SECRET_KEY = 'A-very-very-secret-key-that-must-not-be-exposed-or-sumthing';

async function sign(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}


async function verify(token) {
    try {
      const payload = jwt.verify(token, SECRET_KEY)
      return {success: true, message: payload};
    } catch (err) {
      return {success: false, message: 'Invalid token'};
    }
}


module.exports = {
    sign: sign,
    verify: verify
}