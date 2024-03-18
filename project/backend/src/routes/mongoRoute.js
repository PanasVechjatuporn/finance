const express = require('express')
const router = express.Router()
const mongoController = require('../controllers/mongoController')

router.post('/createuser_provider=:provider', mongoController.createNewUserWithProvider)

router.post('/upsert_monthly',mongoController.upsertUserMonthlyData)

router.get('/userdata_dashboard', mongoController.getUserDataDashboard)

router.get('/funds', mongoController.get_funds)

router.post('/save_tax_goal', mongoController.save_tax_goal)

module.exports = router;
