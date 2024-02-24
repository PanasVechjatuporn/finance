const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env' });

// Connection URL
const url = process.env.MONGO_CONNECTING_STRING;
const client = new MongoClient(url);

// Database Name
const dbName = 'dev';

exports.all_users = async() => {
    await client.connect()
        .then(console.log('Connected successfully to server'))
        .catch(err => console.log(err))
    const db = client.db(dbName)
    const collection = db.collection('users')
    var getResult = await collection.find()
    console.log(getResult)
    client.close()
}

exports.get_user = async() => {
    await client.connect()
        .then(console.log('Connected successfully to server'))
        .catch(err => console.log(err))
    const db = client.db(dbName)
    const collection = db.collection('users')
    var query = {}
}
