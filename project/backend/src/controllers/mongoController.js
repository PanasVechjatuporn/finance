require('dotenv').config({ path: '../.env' });
const client = require('../utils/mongoUtils')
const firebaseAuth = require('../controllers/firebaseAuth');
const { query } = require('express');
// Database Name
const dbName = 'dev';

exports.createNewUser = async (user) => {
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
        console.log('Error occured in mongoController.createNewUser: ', error)
    }
}

exports.createNewUserWithProvider = async (req, res) => {
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
                    let query = { uid: userData.uid }
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
        console.log('Error occured in mongoController.createNewUserWithProvider: ', error)
        res.status(401).json({ message: error });
    }
}

exports.upsertUserMonthlyData = async (req, res) => {
    const upsertData = req.body.upsertData
    const userToken = req.header('Authorization')
    const db = client.db(dbName)
    const collection = db.collection('income_expense')
    try {
        const isVerify = await firebaseAuth.verifyIdToken(userToken, upsertData.user.userId)
        if (isVerify) {
            let query = { userId: upsertData.user.userId, date: upsertData.currentDate };
            await collection.updateOne(
                query,
                {
                    $set: {
                        userId: upsertData.user.userId,
                        date: upsertData.currentDate,
                        incomeData: upsertData.incomeData,
                        expenseData: upsertData.expenseData,
                        investmentData: upsertData.investmentData,
                        year: upsertData.currentDate.split("-")[0],
                        month: parseInt(upsertData.currentDate.split("-")[1]).toString()
                    }
                },
                { upsert: true }
            );
            res.status(200).json({ upsertData })
        } else {
            throw new Error('unauthorized access')
        }
    } catch (error) {
        console.log('Error occured in mongoController.upsertUserMonthlyData: ', error)
        res.status(401).json({ message: error });
    }
}

exports.upsertUserMultipleMonthlyData = async (req, res) => {
    const upsertData = req.body.upsertData
    const userToken = req.header('Authorization')
    const userId = req.header('UserId')
    const db = client.db(dbName)
    const collection = db.collection('income_expense')
    try {
        const isVerify = await firebaseAuth.verifyIdToken(userToken, userId)
        if (isVerify) {
            await Promise.all(upsertData.map(async (data) => {
                let query = { userId: data.user.userId, date: data.currentDate };
                await collection.updateOne(
                    query,
                    {
                        $set: {
                            userId: data.user.userId,
                            date: data.currentDate,
                            incomeData: data.incomeData,
                            expenseData: data.expenseData,
                            investmentData: data.investmentData,
                            year: data.currentDate.split("-")[0],
                            month: parseInt(data.currentDate.split("-")[1]).toString()
                        }
                    },
                    { upsert: true }
                );
            }));
            
            res.status(200).json({ upsertData })
        } else {
            throw new Error('unauthorized access')
        }
    } catch (error) {
        console.log('Error occured in mongoController.upsertUserMonthlyData: ', error)
        res.status(401).json({ message: error });
    }
}

exports.getUserDataDashboard = async (req, res) => {
    const userId = req.header('userId')
    const userToken = req.header('Authorization')
    const queryYear = req.header('year')
    const db = client.db(dbName)
    const collection = db.collection('income_expense')
    try {
        let query = { userId: userId }
        if(queryYear){
            query.year = queryYear
        }
        const queryResult = await collection.find(
            query
        ).toArray();
        res.status(200).json({ queryResult })

    } catch (error) {
        console.log('Error occured in mongoController.getUserDataDashboard: ', error)
        res.status(401).json({ message: error });
    }
}
