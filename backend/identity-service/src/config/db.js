const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
});

let dbConnection;

module.exports = {
    connectToDb: async () => {
        try {
            await client.connect();
            dbConnection = client.db('Cluster0');
            console.log('Successfully connected to MongoDB.');
            return dbConnection;
        } catch (err) {
            console.error('Failed to connect to MongoDB', err);
            process.exit(1);
        }
    },
    getDb: () => {
        if (!dbConnection) {
            throw new Error('Db not initialized');
        }
        return dbConnection;
    },
    getClient: () => client
};
