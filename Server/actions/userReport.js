'use strict'
const { api, Action, action } = require('actionhero');
const jwt = require('../lib/util/jwt');

module.exports = class userReportAction extends Action {
    constructor() {
        super();
        this.name = 'userReport';
        this.description = 'Return an object with relevent user number ';
        this.middleware = ['authorizationMiddleware'];
        // return sum of user
        // return percent of user registered since last week (can do through _id.getTimestamp())
        // return sum for each type of user: client/systemAdmin/clientAdmin
    }


    async executeFunction() {
        try {
            const result = await api.user.userReport();
            return { data: result };
        } catch (error) {
            return { err: error };
        }
    }
    
    async run(data) {
        let dataRes = await this.executeFunction();
        if ('err' in dataRes) {
            throw new Error(dataRes.err);
        }
        else {
            data.response.success = dataRes.data.success;
            data.response.message = dataRes.data.message;
            data.response.report = dataRes.data.data;
        }
    }
}