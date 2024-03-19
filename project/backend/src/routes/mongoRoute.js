const express = require('express')
const router = express.Router()
const mongoController = require('../controllers/mongoController')

router.post('/createuser_provider=:provider', mongoController.createNewUserWithProvider)

router.post('/upsert_monthly',mongoController.upsertUserMonthlyData)

router.post('/upsert_multiple',mongoController.upsertUserMultipleMonthlyData)

router.get('/userdata_dashboard', mongoController.getUserDataDashboard)

router.post('/delete_monthly',mongoController.deleteUserMonthData)

module.exports = router;
