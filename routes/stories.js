var express = require('express');
var parser = require('../routes/parse/parser')

var router = express.Router();




/* GET users listing. */
router.get('/',async function (req, res, next) {


    var p = new parser.Parse();
    p.parseWebPage(async function(req, error) {
        if(req != null) {
            res.send(req);
        } else {
            res.send(error)
        }
    })



});

module.exports = router;