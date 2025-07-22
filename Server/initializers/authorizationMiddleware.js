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
      name: 'authorization middleware',
      global: false,
      apiList: {
        client: ['clientLogin', 'signup', 'addLocation', 'getClient', 'getLocations', 'updateLocation'],
        clinicAdmin: ['adminLogin', 'addLocation', 'getClinics', 'getClient', 'getClients', 'getLocations', 'updateClinic', 
        'updateClinicClientAttendee', 'updateClient', 'updateAdmin', 'updateLocation', 'deleteClient', 'deleteAdmin'],
        systemAdmin: ['addClinic', 'addLocation', 'getClinics', 'getClient', 'getClients', 'getLocations', 'getAdmin', 'getAdmins'],
      },
      preProcessor: async (data) => {
        const payload = jwt.verify(data.params.token);
        if(!apiList[payload.role] || !apiList[payload.role].includes(!data.action)) {
          api.log(`[AUTH FAIL] ${payload.role} tried to access ${actionName}`, 'warning');
          throw new Error('Access denied: Your role does not have sufficient permissions to perform this action.');
        }
        
      }
    };

    api.actions.addMiddleware(authorization);
  }
};