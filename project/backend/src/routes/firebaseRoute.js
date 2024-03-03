const express = require('express');
const router = express();
const firebaseAuth = require('../controllers/firebaseAuth');
router.post('/signup', firebaseAuth.signup);

router.post('/signin', firebaseAuth.signin);

module.exports = router;