var express = require("express");
var router = express.Router();

router.get("/",function(req,res,next){
    //res.send("API in working properly");
    res.json({"temp":["temp1","temp2"]}); //test sending json data
});

module.exports = router;