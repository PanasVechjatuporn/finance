const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env' });

// Connection URL
const url = process.env.MONGO_CONNECTING_STRING;
const client = new MongoClient(url);

// Database Name
const dbName = 'dev';

client.connect()
    .then(console.log('Connected successfully to post server'))
    .catch(err => console.log(err))


exports.edit_dashboard = async () => {
    const db = client.db(dbName)
    const collection = db.collection('users')
}

exports.insert_one_user = async (user) => {
    const db = client.db(dbName)
    const collection = db.collection('users')
    try {
        query = { email: user.email }
        var findResult = await collection.findOne(query)
        if (findResult) {
            console.log('User already existed')
        }
        else {
            obj = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName
            }
            var insertResult = await collection.insertOne(obj)
            console.log(insertResult)
        }
    } catch (error) {
        console.log('Error occured in post_db.inesrst_one_user: ', error)
    }

}