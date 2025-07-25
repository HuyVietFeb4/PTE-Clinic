const { Initializer, api } = require('actionhero');
const jwt = require('../lib/util/jwt');
const clientModel = require("../models/client.js").Model;

// Check ownership/role of incoming request for actions, when client can only make request of that 
// for any actions that clients/admin can do it
module.exports = class ownershipMiddleware extends Initializer { 
  constructor() {
    super();
    this.name = "ownershipMiddleware";
  }

  async initialize() {
    const ownership = {
      name: 'ownership middleware',
      global: false,
      preProcessor: async (data) => {
        const token = data.params.token || data.connection.rawConnection?.req?.headers?.authorization?.split(' ')[1] || data.connection.cookies?.api_auth_token;
        const queryValue = data.params.clientEmail || data.params.locationName;
        const verifyRes = await jwt.verify(token);
        if (!verifyRes.success) {
          throw new Error('Access denied: Your role does not have sufficient permissions to perform this action.');
        }
        const payload = verifyRes.message;
        if(payload.role === 'client') {
          const client = await clientModel.findOne({ id: payload.id }).populate([
            // {
            //   path: 'clinicAttendedID',
            //   populate: {
            //     path: 'clinicLocationID'
            //   }
            // },
            {
              path: 'clientLocationID'
            }
          ]);
          
          if(!Object.values(client?.clientLocationID).includes(queryValue) && !Object.values(client).includes(queryValue)) {
            api.log(`[AUTH FAIL] ${payload.id} tried to access unauthorized resources: ${queryValue}`, 'warning');
            throw new Error('Access denied: Your role does not have sufficient permissions to perform this action.');
          }
        }
        
      }
    };

    api.actions.addMiddleware(ownership);
  }
};