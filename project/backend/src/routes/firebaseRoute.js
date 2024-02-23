const express = require('express');
const router = express.Router();
const firebaseAuth = require('../controllers/firebaseAuth');

router.get('/test', (req, res) => {
    res.json({ message: 'This is a sample JSON response' });
});

router.post('/signup', firebaseAuth.signup);

router.post('/signin', firebaseAuth.signin);

router.post('/signout', firebaseAuth.signout);

module.exports = router;