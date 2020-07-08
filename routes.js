var bodyParser = require('body-parser');
var db = require('./services/dataservice.js');

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
    router.get('/api/movies', function (req, res) {
        db.getMovies(function (err, movies) {
            if (err) {
                res.status(500).send("Unable to get all movies");
            } else {
                res.status(200).send(rooms);
            }
        })
    }); 

    return router;
};

module.exports = routes();