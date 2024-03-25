require("dotenv").config({ path: "../.env" });
const client = require("../utils/mongoUtils");
const firebaseAuth = require("../controllers/firebaseAuth");
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
          let query = { uid: userData.uid };
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
    query = { userId: req.params.uid, year: "2024" };
    var findResult = await collection.find(query).toArray();
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
      .sort({ growthrat_lastmonth: -1 })
      .toArray();
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
    userId: req.body.userId,
    Name: req.body.Name,
    Funds: req.body.Funds,
    Percentage: req.body.Percentage,
    CreatedDate: new Date().toLocaleDateString("en-GB").split(" ")[0],
  };
  //const options = { upsert: true };

  try {
    await collection.insertOne(updateDoc);
  } catch (error) {
    console.log("Error occured in exports.save_tax_goal: ", error);
    res.status(401).json({ message: error });
  }
};

exports.get_growthrate = async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("funds");

  try {
    const query = {};
    const options = {
      _id: 0,
      growthrat_lastmonth: 1,
    };
    var findResult = await collection.find(query).project(options).toArray();
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

exports.getUserGoal = async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("goal");

  try {
    query = { userId: req.params.uid };
    var findResult = await collection.find(query).toArray();
    res.json(findResult);
  } catch (error) {
    console.log("Error occured in exports.getUserGoal: ", error);
    res.status(401).json({ message: error });
  }
};

exports.upsertNewGoal = async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("goal");
  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() + parseInt(req.body.year));
  const period = currentDate.toLocaleDateString("en-GB");
  //
  try {
    const query = { userId: req.body.userId, Name: req.body.Name };
    const update = {
      $set: {
        userId: req.body.userId,
        Name: req.body.Name,
        Period: period,
        Funds: req.body.Funds,
        Goal: req.body.Goal,
        Percentage: req.body.Percentage,
        CreatedDate: new Date().toLocaleDateString("en-GB").split(" ")[0],
      },
    };
    const options = { upsert: true };
    const upsertResult = await collection.updateOne(query, update, options);
    res.status(200).json({ message: "upsert new goal successfully" });
  } catch (err) {
    console.log("Error occured in mongoController.upsertNewGoal: ", err);
  }
};

exports.changeMultipleGoalPercentage = async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("goal");
  const userToken = req.header("Authorization");
  const userId = req.header("UserId");
  try {
    const isVerify = await firebaseAuth.verifyIdToken(userToken, userId);
    if (isVerify) {
      await Promise.all(
        req.body.goal.map(async (data) => {
          const query = { userId: data.userId, Name: data.Name };
          await collection.updateOne(
            query,
            {
              $set: {
                Percentage: data.Percentage,
              },
            },
            { upsert: true }
          );
        })
      );
      res.status(200);
    }
  } catch (err) {
    console.log("Error occured in mongoController.changeGoalPercentage: ", err);
  }
};

exports.getUserGoal = async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("goal");

  try {
    query = { userId: req.params.uid };
    var findResult = await collection.find(query).toArray();
    res.json(findResult);
  } catch (error) {
    console.log("Error occured in exports.getUserGoal: ", error);
    res.status(401).json({ message: error });
  }
};

exports.getUserRiskProfile = async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("risk_profile");
  try {
    query = { uid: req.params.uid };

    var findResult = await collection.find(query).toArray();
    console.log(findResult);
    res.json(findResult);
  } catch (error) {
    console.log("Error occured in exports.testUser: ", error);
    res.status(401).json({ message: error });
  }
};

exports.upsertRiskProfile = async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("risk_profile");
  const userToken = req.header("Authorization");
  const userId = req.header("UserId");
  try {
    const isVerify = await firebaseAuth.verifyIdToken(userToken, userId);
    if (isVerify) {
      // console.log("params: ",req.body)
      // console.log(req.params.riskProfile);
      const query = { uid: req.body.userId };
      const update = {
        $set: {
          riskProfile: req.body.riskProfile,
        },
      };
      const option = { upsert: true };
      updateResult = await collection.updateOne(query, update, option);
      console.log(updateResult);
      if (updateResult.upsertedCount > 0) {
        console.log(`A new document was inserted with the uid: ${query.uid}`);
      } else if (updateResult.modifiedCount > 0) {
        console.log(`The document with the uid: ${query.uid} was updated`);
      } else {
        console.log(`No changes were made for the document with the uid: ${query.uid}`);
      }
      res.status(200);
    }
  } catch (err) {
    console.log("Error occured in mongoController.changeGoalPercentage: ", err);
  }
};
