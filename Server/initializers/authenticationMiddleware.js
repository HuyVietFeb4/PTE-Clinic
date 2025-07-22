const { Initializer, api } = require('actionhero');
const jwt = require('../lib/util/jwt');
// Create token and pass to action
// Only add to log in 
module.exports = class AuthenticationMiddleware extends Initializer { 
  constructor() {
    super();
    this.name = "authenticationMiddleware";
  }

  async initialize() {
    const authenticate = {
      name: 'authentication middleware',
      global: false,

    //   preProcessor: async (data) => {
    //     const payload = {
    //       email: data.params.email,
    //       password: data.params.password,
    //       role: data.params.role
    //     }
    //     const token = jwt.sign(payload);
    //     data.params.token = token;
    //   },

      postProcessor: async (data) => {
        const token = data.response.token;
        if (!token) {
          throw new Error("Unauthorized: Invalid token");
        }
      },
    };

    api.actions.addMiddleware(authenticate);
  }
};