'use strict'
const { api, Action, action } = require('actionhero');
const jwt = require('../lib/util/jwt');

module.exports = class validateTokenAction extends Action {
    constructor() {
        super();
        this.name = 'validateToken';
        this.description = 'Vaidate jwt token to access to frontend pages';
    }


    async run(data) {
        const token = data.connection.rawConnection?.cookies?.api_auth_token || data.params.token || data.connection.rawConnection?.req?.headers?.authorization?.split(' ')[1] ;
        if (!token) {
            throw new Error('Unauthorized: Token missing');
        }
        const verifyRes = await jwt.verify(token);
        if (!verifyRes.success) {
          data.response.success = false;
          data.response.message = verifyRes.message;
        }
        const payload = verifyRes.message;
        data.response.success = true;
        data.response.user = payload;
    }
}