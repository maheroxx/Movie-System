var express = require('express');
var expressValidator = require('express-validator');
var app = express();
//app.use(bodyParser.urlencoded({ extended: true })); 
app.use(expressValidator());

var port = 3000;

var routes = require('./routes.js');
app.use('/', routes);

app.listen(port, function () {
    console.log('Server started on port ' + port);
});