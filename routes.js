var bodyParser = require('body-parser');
var db = require('./services/dataservice.js');
//const customersController = require('./controllers/customerController.js');

db.connect();

var routes = function () {
    var router = require('express').Router();
    
    router.use(bodyParser.urlencoded({
        extended: true
    }));

    router.get('/css/*', function(req, res)  {
        res.sendFile(__dirname+"/views/"+req.originalUrl);
    });
    
    router.get('/js/*', function(req, res)  {
        res.sendFile(__dirname+"/views/"+req.originalUrl);
    });

    router.get('/', function(req, res) {
        res.sendFile(__dirname+"/views/index.html");
    });

    router.get('/register', function(req, res) {
        res.sendFile(__dirname+"/views/registration.html");
    });

    router.get('/login', function(req, res) {
        res.sendFile(__dirname+"/views/login.html");
    });

    router.post('/register', function(req, res){
        var data = req.body;
        db.addCustomer(data.username,data.email,data.mobilenumber,data.creditcard,data.password
            ,function(err,customer)
            {
                if (err) {
                    res.status(500).send("Unable to register");
                } else {
                    res.status(200).send("Register successful!");
                }
            })
    });

    return router;
};
module.exports = routes();