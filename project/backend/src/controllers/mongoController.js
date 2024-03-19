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
            throw new Error('unauthorized access isVerify flag == false')
        }
    } catch (error) {
        console.log('Error occured in mongoController.create_new_user_provider: ', error)
        res.status(401).json({ message: error });
    }
}

exports.get_user_data_income_expense = async (req, res) => {
    const db = client.db(dbName)
    const collection = db.collection('income_expense')

    try {
        query = { userId: req.params.uid }
        var findResult = await collection.find(query).toArray();
        console.log(findResult);
        res.json(findResult);

    } catch (error) {
        console.log('Error occured in exports.get_user_data_income_expense: ', error)
        res.status(401).json({ message: error });

    }
}

exports.get_funds = async (req, res) => {
    const db = client.db(dbName)
    const collection = db.collection('funds')

    try {
        query = {};
        var findResult = await collection.find(query).project({ "_id": 1, "proj_name_th": 1, "proj_name_en": 1, "growthrat_lastmonth": 1, "url_factsheet": 1 }).sort({ "growthrat_lastmonth": -1 }).toArray();
        console.log(findResult);
        res.json(findResult);

    } catch (error) {
        console.log('Error occured in exports.get_funds: ', error)
        res.status(401).json({ message: error });

    }
}

exports.save_tax_goal = async (req, res) => {
    const db = client.db(dbName)
    const collection = db.collection('goal')

    //เอาไว้หา UserId
    const filter = { userId: req.body.uid };

    const updateDoc = {
        $set: {
            userId: req.body.uid,
            funds: req.body.confirmData
        }
    };
    const options = { upsert: true };


    try {
        //ถ้า filter ไม่เจอ สร้างเป็น obj ใหม่(upsert)
        await collection.updateOne(filter, updateDoc, options)
    } catch (error) {
        console.log('Error occured in exports.save_tax_goal: ', error)
        res.status(401).json({ message: error });

    }
}

exports.getUserGoal = async (req, res) => {
    const db = client.db(dbName)
    const collection = db.collection('goal');

    try {
        query = { userId: req.params.uid }
        var findResult = await collection.find(query).toArray();
        res.json(findResult);

    } catch (error) {
        console.log('Error occured in exports.getUserGoal: ', error)
        res.status(401).json({ message: error });

    }
}
