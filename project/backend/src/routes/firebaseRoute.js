const express = require('express');
const router = express();
const firebaseAuth = require('../controllers/firebaseAuth');

router.post('/signup', async function (req, res) {
    var user = await firebaseAuth.signup(req, res)
});

router.post('/signin', async function (req, res) {
    var user = await firebaseAuth.signin(req, res)
});

module.exports = router;