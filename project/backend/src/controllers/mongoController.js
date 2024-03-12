require('dotenv').config({ path: '../.env' });
const client = require('../utils/mongoUtils')
const firebaseAuth = require('../controllers/firebaseAuth')
// Database Name
const dbName = 'dev';

exports.create_new_user = async (user) => {
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
    const userData = req.body.userData.user
    const idToken = req.body.userData._tokenResponse.idToken
    const provider = req.params.provider
    const db = client.db(dbName)
    const collection = db.collection('users')
    try {
        const isVerify = await firebaseAuth.verifyIdToken(idToken, userData.uid)
        if (isVerify) {
            switch (provider) {
                case 'google':
                    obj = {
                        uid: userData.uid,
                        email: userData.email,
                        displayName: userData.displayName,
                        provider: provider
                    }
                    query = { uid: userData.uid }
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
        } else {
            throw new Error('unauthorized access')
        }
    } catch (error) {
        console.log('Error occured in mongoController.create_new_user_provider: ', error)
        res.status(401).json({ message: error });
    }
}

exports.upsert_user_monthly_data = async (req, res) => {
    const upsertData = req.body.upsertData
    const userToken = req.header('Authorization')
    const db = client.db(dbName)
    const collection = db.collection('income_expense')
    try {
        const isVerify = await firebaseAuth.verifyIdToken(userToken, upsertData.user.userId)
        if (isVerify) {
            console.log('upsertData :: ', upsertData)
            query = { userId: upsertData.user.userId, date: upsertData.currentDate };
            await collection.updateOne(
                query,
                {
                    $set: {
                        userId: upsertData.user.userId,
                        date: upsertData.currentDate,
                        incomeData: upsertData.incomeData,
                        expenseData: upsertData.expenseData,
                        investmentData: upsertData.investmentData
                    }
                },
                { upsert: true }
            );
            res.status(200).json({ upsertData })
        } else {
            throw new Error('unauthorized access')
        }
    } catch (error) {
        console.log('Error occured in mongoController.upsert_user_monthly_data: ', error)
        res.status(401).json({ message: error });
    }
}

exports.get_user_data_income_expense = async (req, res) => {
    const userId = req.header('userId')
    const userToken = req.header('Authorization')
    const db = client.db(dbName)
    const collection = db.collection('income_expense')
    try {
        res.status(200).json({})

    } catch (error) {
        console.log('Error occured in mongoController.get_user_data_income_expense: ', error)
        res.status(401).json({ message: error });
    }
}
