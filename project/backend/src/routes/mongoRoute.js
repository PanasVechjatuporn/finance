const express = require("express");
const router = express.Router();
const mongoController = require("../controllers/mongoController");

router.post("/createuser_provider=:provider", mongoController.createNewUserWithProvider);

router.post("/upsert_monthly", mongoController.upsertUserMonthlyData);

router.get("/userdata_dashboard", mongoController.getUserDataDashboard);

router.get("/userdata=:uid", mongoController.getUserDataIncomeExpense);

router.get("/funds", mongoController.getFunds);

router.post("/save_tax_goal", mongoController.saveTaxGoal);

router.get("/get_growthrate", mongoController.getGrowthRate);

router.post("/upsert_multiple", mongoController.upsertUserMultipleMonthlyData);

router.post("/delete_monthly", mongoController.deleteUserMonthData);

router.get('/usergoal=:uid', mongoController.getUserGoal);

router.get('/userassets=:uid', mongoController.getUserAsset);

router.post("/upsert_new_goal", mongoController.upsertNewGoal);

router.post("/change_goal_percentage", mongoController.changeMultipleGoalPercentage);

router.get("/get_user_asset", mongoController.getUserAssetGoalBased);

router.get("/get_user_goal", mongoController.getUserGoalGoalBased);

router.post('/stop_goal', mongoController.stopGoal);

router.post('/delete_goal', mongoController.deleteGoal);

router.get("/get_user_risk_profile", mongoController.getUserRiskProfile);
module.exports = router;
