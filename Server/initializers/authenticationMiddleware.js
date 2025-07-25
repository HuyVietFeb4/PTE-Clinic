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
      name: 'authenticationMiddleware',
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
        if (!token && data.response.success) {
          throw new Error("Unauthorized: Invalid token");
        }

        // const cookieString = `api_auth_token=${token}; Path=/; Max-Age=3600`
        // data.connection.rawConnection.responseHeaders.push(["Set-Cookie", cookieString]);
        // data.response.token = '';
      },
    };

    api.actions.addMiddleware(authenticate);
  }
};