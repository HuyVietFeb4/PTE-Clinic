const { Initializer, api } = require('actionhero');
const jwt = require('../lib/util/jwt');
// Check authorization of incoming request for actions
// Having lists of apis with level of confidentiality for different roles
module.exports = class authorizationMiddleware extends Initializer { 
  constructor() {
    super();
    this.name = "authorizationMiddleware";
  }

  async initialize() {
    const authorization = {
      name: 'authorizationMiddleware',
      global: false,
      apiList: {
        client: ['clientLogin', 'signup', 'addLocation', 'getClient', 'getLocations', 'updateLocation'],
        clinicAdmin: ['adminLogin', 'addLocation', 'getClinics', 'getClient', 'getClients', 'getLocations', 'updateClinic', 
        'updateClinicClientAttendee', 'updateClient', 'updateAdmin', 'updateLocation', 'deleteClient', 'deleteAdmin'],
        systemAdmin: ['addClinic', 'addLocation', 'getClinics', 'getClient', 'getClients', 'getLocations', 'getAdmin', 'getAdmins'],
      },
      preProcessor: async (data) => {
        const token = data.params.token || data.connection.rawConnection?.req?.headers?.authorization?.split(' ')[1] || data.connection.cookie?.api_auth_token;
        const verifyRes = await jwt.verify(token);
        if (!verifyRes.success) {
          throw new Error('Access denied: Your role does not have sufficient permissions to perform this action.');
        }
        const payload = verifyRes.message;
        if (payload.accountStatus !== 'activated') {
          throw new Error('Access denied: Your account has not been activated, please contact our support for more information');
        }
        if(!apiList[payload.role] || !apiList[payload.role].includes(!data.action)) {
          api.log(`[AUTH FAIL] ${payload.role} tried to access ${actionName}`, 'warning');
          throw new Error('Access denied: Your role does not have sufficient permissions to perform this action.');
        }
        
      }
    };

    api.actions.addMiddleware(authorization);
  }
};