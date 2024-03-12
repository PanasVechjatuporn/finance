const express = require('express')
const router = express.Router()
const mongoController = require('../controllers/mongoController')

router.post('/createuser_provider=:provider', mongoController.create_new_user_provider)

router.post('/upsert_monthly',mongoController.upsert_user_monthly_data)

router.get('/userdata', mongoController.get_user_data_income_expense)


module.exports = router;
