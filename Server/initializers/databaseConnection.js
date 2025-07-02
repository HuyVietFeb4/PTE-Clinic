const mongoose = require("mongoose");
const { Initializer } = require("actionhero");
module.exports = class databaseConnect extends Initializer {
    constructor() {
        super();
        this.name = "databaseConnect";
    }
    async initialize() {
        const uri = "mongodb://localhost:27018,localhost:27019,localhost:27020/?replicaSet=rs0";
        try {
            await mongoose.connect(uri);
        } catch(error) {
            throw new Error("MongoDB connection error:", { cause: error });
        }
    }
}