const { Initializer, api } = require('actionhero');

// To prevent anyone but autorized entity to touch system admin api
module.exports = class systemAdminMiddleware extends Initializer { 
  constructor() {
    super();
    this.name = "systemAdminMiddleware";
  }

  async initialize() {
    const systemAdminMiddleware = {
      name: "systemAdminMiddleware",
      global: false,
      preProcessor: async (data) => {
        const token = data.params.token || data.connection.rawConnection?.req?.headers?.authorization?.split(' ')[1] || data.connection.cookies?.api_auth_token;
        
        if(token !== 'i-have-been-authorized-by-the-company-to-use-system-admin-api') {
            api.log(`[AUTH FAIL] someone try to use system admin api`, 'warning');
            throw new Error('Access denied: Invalid or missing authorization token.');
        }
        
      },
    };

    api.actions.addMiddleware(systemAdminMiddleware);
  }
};