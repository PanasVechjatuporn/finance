const express = require('express');
const router = express();
const mongoController = require('../controllers/mongoController')

router.post('/createuser_provider=:provider', mongoController.create_new_user_provider)

router.get('/userdata=:uid', mongoController.get_user_data_income_expense)

router.get('/funds', mongoController.get_funds)

router.post('/save_tax_goal', mongoController.save_tax_goal)

module.exports = router;
