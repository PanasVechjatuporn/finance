const express = require("express");
const router = express.Router();
const mongoController = require("../controllers/mongoController");

router.post(
  "/createuser_provider=:provider",
  mongoController.createNewUserWithProvider
);

router.post("/upsert_monthly", mongoController.upsertUserMonthlyData);

router.get("/userdata_dashboard", mongoController.getUserDataDashboard);

router.get("/userdata=:uid", mongoController.get_user_data_income_expense);

router.get("/funds", mongoController.get_funds);

router.post("/save_tax_goal", mongoController.save_tax_goal);

router.get("/get_growthrate", mongoController.get_growthrate);

router.post("/upsert_multiple", mongoController.upsertUserMultipleMonthlyData);

router.post("/delete_monthly", mongoController.deleteUserMonthData);

router.get("/usergoal=:uid", mongoController.getUserGoal);

router.post("/upsert_new_goal", mongoController.insertNewGoal);

router.post("/change_goal_percentage", mongoController.changeMultipleGoalPercentage)

router.get("/user_risk_profile=:uid", mongoController.getUserRiskProfile)

router.post("/upsert_risk_profile=:uid", mongoController.upsertRiskProfile)

router.post('/post_asset_from_goal', mongoController.postAssetFromGoal)

module.exports = router;
