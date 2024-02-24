const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env' });

// Connection URL
const url = process.env.MONGO_CONNECTING_STRING;
const client = new MongoClient(url);

// Database Name
const dbName = 'dev';

client.connect()
    .then(console.log('Connected successfully to get server'))
    .catch(err => console.log(err))


exports.all_users = async () => {
    const db = client.db(dbName)
    const collection = db.collection('users')
    var getResult = await collection.find()
    console.log(getResult)
}

exports.get_user = async () => {
    const db = client.db(dbName)
    const collection = db.collection('users')
    var query = {}
}
