var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.render('home', { title: 'Express' ,
        name : req.user.displayName,
        pic : req.user.photos[0].value});
});




module.exports = router;
