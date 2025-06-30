var mongoose = require('mongoose');
var converter = require('../lib/util/MongoDbConverter.js');
var db = mongoose.connection;
var config = require('../config/pteverywhere.js').default.pteverywhere();

const { networkInterfaces } = require('os');
const nets = networkInterfaces();
const results = Object.create(null);
for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}
var dbUrl = config.dbUrl;
var options = config.dbOptions;

mongoose.connect(dbUrl, options);

db.on('error', function (err) {
    console.log(err);
});

db.once('open', function (callback) {
    console.log('Succeeded connected to: ' + dbUrl);
    console.log('Time: ' + new Date());
    console.log('Do not migrate anymore!');
});

const originalCast = mongoose.Number.cast();
mongoose.Number.cast(v => {
    if (v == 'null') {
        return "";
    }
    return originalCast(v);
});

var DBService = {
    getConnection: function () {
        return db;
    }
};

DBService.getSession = async function()
{
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'majority' },
        writeConcern: { w: 'majority' }
    };

    var session = await db.startSession();

    session.startTransaction(transactionOptions);

    return session;
};

DBService.getSessionWithoutTransaction = async function()
{
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'majority' },
        writeConcern: { w: 'majority' }
    };

    var session = await db.startSession();

    return session;
};

DBService.close = function(){
   console.log("Close connection!");

    db.close();
};

DBService.putItem = function (item, indexs, model, schema, isExist, next) {
    if (item == null || item == undefined)
        next(null, null);

    if (isExist) // isExist == true => insert or replace item
        upsertFunction(item, indexs, model, schema, true, function (err, data) {
            next(err, data);
        });
    else // isExist == false => insert new item
        insertFunction(item, model, schema, function (err, data) {
            next(err, data);
        });
}

DBService.batchWriteItem = function (items, indexs, model, schema, next) {
    if (items == null || items == undefined)
        next(null, null);

    for (var index in items) {
        upsertFunction(items[index], indexs, model, schema, false, function (err) {
            next(err, null);
        });
    }


}

DBService.getTransactionOptions = async function()
{
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'majority' },
        writeConcern: { w: 'majority' }
    };

    return transactionOptions;
};

DBService.getSession = async function()
{
    const transactionOptions = await DBService.getTransactionOptions();

    var session = await db.startSession();

    session.startTransaction(transactionOptions);

    return session;
};


var insertFunction = function (item, model, schema, next) {
    var modelCreate = new model();
    var create = converter.ConvertJsonObjectToMongoModel(modelCreate, schema, item);
    create.save(function (err, itemResult) {
        if (err) {
            next(err, null);
        }
        else
            next(null, itemResult);
    });
}

var upsertFunction = function (item, indexs, model, schema, isReturnData, next) {
    // Get conditions from indexs
    var conditions = converter.GetIndexCondition(item, indexs);


    if (Object.keys(conditions).length == 0) {
        if (isReturnData)
            next('CreateConditionFail___', null);
        else
            next('CreateConditionFail___');
    }

    model.findOne(conditions).exec(function (err, result) {
        if (err) {
            if (isReturnData)
                next('FindItemFail___', null);
            else
                next('FindItemFail___');
        }
        else {
            if (result) // item exist override item
            {
                model.update(conditions, item, { overwrite: true }, function (err, data) {
                    if (isReturnData)
                        next(err, data);
                    else
                        next(err);
                });
            }
            else // item does not exist, insert new one
            {
                insertFunction(item, model, schema, function (err, data) {
                    if (isReturnData)
                        next(err, data);
                    else
                        next(err);
                });
            }
        }
    });
};

module.exports = DBService;

