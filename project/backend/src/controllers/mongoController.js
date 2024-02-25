require('dotenv').config({ path: '../.env' });
const client = require('../utils/mongoUtils')

// Database Name
const dbName = 'dev';

exports.create_new_user = async (user) => {
    console.log(user)
    const db = client.db(dbName)
    const collection = db.collection('users')
    try {
        query = { uid: user.uid }
        var findResult = await collection.findOne(query)
        if (findResult) {
            console.log('User already existed')
        }
        else {
            obj = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                provider: 'none'
            }
            var insertResult = await collection.insertOne(obj)
            console.log(insertResult)
        }
    } catch (error) {
        console.log('Error occured in mongoController.create_new_user: ', error)
    }
}
exports.create_new_user_provider = async (req, res) => {
    const userData = JSON.parse(req.body.userData)
    const provider = req.params.provider
    const db = client.db(dbName)
    const collection = db.collection('users')
    try {
        switch (provider) {
            case 'google':
                obj = {
                    uid: userData.localId,
                    email: userData.email,
                    displayName: userData.displayName,
                    provider: provider
                }
                query = { uid: userData.localId }
                var findResult = await collection.findOne(query)
                if (findResult) {
                    await collection.findOneAndReplace(query, obj, { returnNewDocument: true })
                }
                else {
                    await collection.insertOne(obj)
                }
                break;
            default:
                throw new Error('Unknown Provider');
        }
        res.status(200).json({ userData });
    } catch (error) {
        console.log('Error occured in mongoController.create_new_user_provider: ', error)
        res.status(401).json({ message: error });
    }
}

