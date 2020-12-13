const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const mongoDbUrl = require('../../init');

let database;

const init = (callback) => {
    if (database) {
        console.log('Database is already initialized.');
        return callback(null, database);
    }

    MongoClient 
    .connect(mongoDbUrl)
    .then((client) => {
        database = client;
        callback(null, database);
    })
    .catch((error) => {
      callback(error);
    });
};

const get = () => {
    if (!database) throw Error('Datbase not initialized');
    return database;
};

module.exports = {
    init,
    get,
};
