const express = require('express');
const router = express.Router();
const firebaseAuth = require('../controllers/firebaseAuth');
router.post('/signup', firebaseAuth.signUp);

router.post('/signin', firebaseAuth.signIn);

router.post('/veriylocaluser', firebaseAuth.verifyLocalUser);

module.exports = router;