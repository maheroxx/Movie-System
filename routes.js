var bodyParser = require('body-parser');

var routes = function () {
    var router = require('express').Router();
    
    router.use(bodyParser.urlencoded({
        extended: true
    }));

    router.get('/', function(req, res) {
        res.sendFile(__dirname+"/views/index.html");
    });
    return router;
};
