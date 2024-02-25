const express = require('express');
const router = express();
const mongoController = require('../controllers/mongoController')

router.post('/createuser_provider=:provider', mongoController.create_new_user_provider)

module.exports = router;
