require("dotenv").config({ path: "../.env" });
const client = require("../utils/mongoUtils");
const firebaseAuth = require("../controllers/firebaseAuth");
const { query } = require("express");
// Database Name
const dbName = "dev";

exports.createNewUser = async (user) => {
  const db = client.db(dbName);
  const collection = db.collection("users");
  try {
    query = { uid: user.uid };
    var findResult = await collection.findOne(query);
    if (findResult) {
      console.log("User already existed");
    } else {
      obj = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        provider: "none",
      };
      var insertResult = await collection.insertOne(obj);
      console.log(insertResult);
    }
  } catch (error) {
    console.log("Error occured in mongoController.createNewUser: ", error);
  }
};

exports.createNewUserWithProvider = async (req, res) => {
  const userData = req.body.userData.user;
  const idToken = req.body.userData._tokenResponse.idToken;
  const provider = req.params.provider;
  const db = client.db(dbName);
  const collection = db.collection("users");
  try {
    const isVerify = await firebaseAuth.verifyIdToken(idToken, userData.uid);
    if (isVerify) {
      switch (provider) {
        case "google":
          obj = {
            uid: userData.uid,
            email: userData.email,
            displayName: userData.displayName,
            provider: provider,
          };
          query = { uid: userData.uid };
          var findResult = await collection.findOne(query);
          if (findResult) {
            await collection.findOneAndReplace(query, obj, {
              returnNewDocument: true,
            });
          } else {
            await collection.insertOne(obj);
          }
          break;
        default:
          throw new Error("Unknown Provider");
      }
      res.status(200).json({ userData });
    } else {
      throw new Error("unauthorized access");
    }
  } catch (error) {
    console.log(
      "Error occured in mongoController.createNewUserWithProvider: ",
      error
    );
    res.status(401).json({ message: error });
  }
};

exports.upsertUserMonthlyData = async (req, res) => {
  const upsertData = req.body.upsertData;
  const userToken = req.header("Authorization");
  const db = client.db(dbName);
  const collection = db.collection("income_expense");
  try {
    const isVerify = await firebaseAuth.verifyIdToken(
      userToken,
      upsertData.user.userId
    );
    if (isVerify) {
      console.log("upsertData :: ", upsertData);
      query = { userId: upsertData.user.userId, date: upsertData.currentDate };
      await collection.updateOne(
        query,
        {
          $set: {
            userId: upsertData.user.userId,
            date: upsertData.currentDate,
            incomeData: upsertData.incomeData,
            expenseData: upsertData.expenseData,
            investmentData: upsertData.investmentData,
          },
        },
        { upsert: true }
      );
      res.status(200).json({ upsertData });
    } else {
      throw new Error("unauthorized access");
    }
  } catch (error) {
    console.log(
      "Error occured in mongoController.upsertUserMonthlyData: ",
      error
    );
    res.status(401).json({ message: error });
  }
};

exports.get_user_data_income_expense = async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("income_expense");

  try {
    query = {};
    var findResult = await collection.find(query).toArray();
    console.log(findResult);
    res.json(findResult);
  } catch (error) {
    console.log(
      "Error occured in exports.get_user_data_income_expense: ",
      error
    );
    res.status(401).json({ message: error });
  }
};

exports.get_funds = async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("funds");

  try {
    query = {};
    var findResult = await collection
      .find(query)
      .project({
        _id: 1,
        proj_name_th: 1,
        proj_name_en: 1,
        growthrat_lastmonth: 1,
        url_factsheet: 1,
      })
      .toArray();
    console.log(findResult);
    res.json(findResult);
  } catch (error) {
    console.log("Error occured in exports.get_funds: ", error);
    res.status(401).json({ message: error });
  }
};

exports.save_tax_goal = async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("goal");

  //เอาไว้หา UserId
  const filter = {};

  const updateDoc = {
    $set: {
      funds: req.body.confirmData,
    },
  };
  const options = { upsert: true };

  try {
    //ถ้า filter ไม่เจอ สร้างเป็น obj ใหม่(upsert)
    await collection.updateOne(filter, updateDoc, options);
  } catch (error) {
    console.log("Error occured in exports.save_tax_goal: ", error);
    res.status(401).json({ message: error });
  }
};

exports.get_growthrate = async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("goal");

  try {
    const query = {};
    const options = {
      projection: { _id: 0, growthrat_lastmonth: 1 },
    };

    const findResult = collection.find(query).project(options);
    console.log(findResult);
    res.status(200).json({ findResult });
  } catch (error) {
    console.log("Error occured in exports.get_growthrate: ", error);
    res.status(401).json({ message: error });
  }
};
exports.upsertUserMultipleMonthlyData = async (req, res) => {
  const upsertData = req.body.upsertData;
  const userToken = req.header("Authorization");
  const userId = req.header("UserId");
  const db = client.db(dbName);
  const collection = db.collection("income_expense");
  try {
    const isVerify = await firebaseAuth.verifyIdToken(userToken, userId);
    if (isVerify) {
      await Promise.all(
        upsertData.map(async (data) => {
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
                month: parseInt(data.currentDate.split("-")[1]).toString(),
              },
            },
            { upsert: true }
          );
        })
      );

      res.status(200).json({ upsertData });
    } else {
      throw new Error("unauthorized access");
    }
  } catch (error) {
    console.log(
      "Error occured in mongoController.upsertUserMonthlyData: ",
      error
    );
    res.status(401).json({ message: error });
  }
};

exports.getUserDataDashboard = async (req, res) => {
  const userId = req.header("userId");
  const userToken = req.header("Authorization");
  const queryYear = req.header("year");
  const db = client.db(dbName);
  const collection = db.collection("income_expense");
  try {
    let query = { userId: userId };
    if (queryYear) {
      query.year = queryYear;
    }
    const queryResult = await collection.find(query).toArray();
    res.status(200).json({ queryResult });
  } catch (error) {
    console.log(
      "Error occured in mongoController.getUserDataDashboard: ",
      error
    );
    res.status(401).json({ message: error });
  }
};

exports.deleteUserMonthData = async (req, res) => {
  const year = req.body.year;
  const month = req.body.month;
  const userToken = req.header("Authorization");
  const userId = req.header("UserId");
  const db = client.db(dbName);
  const collection = db.collection("income_expense");
  try {
    const isVerify = await firebaseAuth.verifyIdToken(userToken, userId);
    if (isVerify) {
      let query = { year: year, month: month, userId: userId };
      const queryResult = await collection.deleteOne(query);
      res.status(200).json({ message: "delete success" });
    } else {
      throw new Error("unauthorized access");
    }
  } catch (error) {
    console.log(
      "Error occured in mongoController.upsertUserMonthlyData: ",
      error
    );
    res.status(401).json({ message: error });
  }
};
