const express = require("express");
const firebaseRoute = require('./src/routes/firebaseRoute');
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/auth', firebaseRoute);

module.exports = app;
const PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
    console.log(`Server is running on port ${PORT}`);
});