const express = require('express');
const router = express();
const firebaseAuth = require('../controllers/firebaseAuth');
router.post('/signup', firebaseAuth.signup);

router.post('/signin', firebaseAuth.signin);

router.post('/veriylocaluser', firebaseAuth.verifyLocalUser);

module.exports = router;