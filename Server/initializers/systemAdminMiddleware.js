const { Initializer, api } = require('actionhero');
const clientModel = require("../models/client.js").Model;

// To prevent anyone but autorized entity to touch system admin api
module.exports = class systemAdminMiddleware extends Initializer { 
  constructor() {
    super();
    this.name = "systemAdminMiddleware";
  }

  async initialize() {
    const systemAdminMiddleware = {
      name: 'system admin middleware',
      global: false,
      preProcessor: async (data) => {
        const token = data.params.token || data.connection.rawConnection?.req?.headers?.authorization?.split(' ')[1];
        
        if(token !== 'i-have-been-authorized-by-the-company-to-use-system-admin-api') {
            api.log(`[AUTH FAIL] some one try to use system admin api`, 'warning');
            throw new Error('Access denied: Your role does not have sufficient permissions to perform this action.');
        }
        
      }
    };

    api.actions.addMiddleware(systemAdminMiddleware);
  }
};