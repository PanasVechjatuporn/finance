const express = require('express');
const router = express();
const get_db = require('../controllers/getDatabase')
const post_db = require('../controllers/postDatabase')

// Get route
router.get('/all_users', async function(req, res){
    try {
        const users = await get_db.all_users();
        res.status(200).send('Done')
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
})

router.get('/get_user', async function(req, res){
    try {
        
    } catch (error) {
        
    }
})


// Post route
router.post('/insert_one', async function(req, res){
    try {
        const user = await post_db.insert_one_user();
        res.status(200).send('Done')
    } catch (error){
        console.error("Can't insert data")
        res.status(500).json("Can't insert data")
    }
})

module.exports = router;
