const express = require('express');
const router = express();
const firebaseAuth = require('../controllers/firebaseAuth');

router.get('/test', (req, res) => {
    res.json({ message: 'This is a sample JSON response' });
});

// router.post('/signup', firebaseAuth.signup());
router.post('/signup', async function (req, res) {
    var user = await firebaseAuth.signup(req, res)
});

router.post('/signin', async function (req, res) {
    var user = await firebaseAuth.signin(req, res)
});

// router.post('/signout', firebaseAuth.signout());

// router.post('/signin/checkuid', firebaseAuth.checkuid());


module.exports = router;