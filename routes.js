var bodyParser = require('body-parser');
var db = require('./services/dataservice.js');
var crypto = require('crypto');

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

    //view index
    router.get('/', function(req, res) {
        res.sendFile(__dirname+"/views/index.html");
    });


    //view register page
    router.get('/register', function(req, res) {
        res.sendFile(__dirname+"/views/registration.html");
    });

    //view login page
    router.get('/login', function(req, res) {
        res.sendFile(__dirname+"/views/login.html");
    });

    // view index after login page
    router.get('/index_after_login', function(req, res) {
        res.sendFile(__dirname+"/views/index_after_login.html");
    });

    //view profile
    router.get('/profilepage', function(req, res) {
        res.sendFile(__dirname+"/views/profile.html");
    });

    //search movies
    router.get('/search', function(req, res) {
        res.sendFile(__dirname+"/views/search.html");
    });

    router.post('/search', function(req,res)
    {   var title = req.body.title;
        db.searchMovie(title,function(err,movies)
        {
            res.send(movies);
            
        })
    })

    // add customer to the database
    router.post('/register', function(req, res){
        var username = req.body.username;
        var email = req.body.email;
        var mobilenumber = req.body.mobilenumber;
        var password =req.body.password;
        var confirmpass = req.body.confirmpass;
        var creditcard = req.body.creditcard;

      
        db.addCustomer(username,email,mobilenumber,creditcard,password
            ,function(err,customer)
            {
                if (err) {
                    res.status(500).send("Unable to register");
                } else {
                    res.redirect('/index_after_login');
            }
        })
    
    });

    //user login
    router.post('/loginform', function(req,res) {
        var data = req.body;
        db.login(data.username, data.password,function(err, customer){
            if(err){
                res.status(401).send("Login unsuccessful. Please try again");
                res.redirect('/login');
            }
            else{
                if(customer == null){
                    res.status(401).send("Login unsuccessful. Please try again");
                    //res.status(401).json({'message':'login unsuccessful. Please check username or password'});
                   
                }
                else{
                    var strToHash = customer.username + Date.now();
                    var token = crypto.createHash('md5').update(strToHash).digest('hex');
                    db.updateToken(customer._id,token,function(err, customer)
                    {
                        //res.status(200).json({'token':token});
                        res.redirect('index_after_login');
                    })
                }
            }
        })

       
    });

    //logout
    router.get('/logout', function(req, res)
    {
       var token = req.query.token;
       if(token == undefined){
           res.status(401).send("No tokens are provided");
       }
       else{
           db.checkToken(token, function(err,customer){
               if(err || customer == null){
                   res.status(401).send("Invalid token");
               }
               else{
                   db.checkToken(customer._id, "",function(err, customer){
                    res.status(200).send("Logout successfully");
                   });
               }
           })
       }
    });

    // display all the movies
    router.get('/movies', function(req, res)
    {
        db.getMovies(function(err, movies)
        {
            res.send(movies);
        })
        
    });

    router.get('/profile',function(req, res)
    {
        db.getCustomerInfo(function(err,customer)
        {
            res.send(customer);
        })
    });
    //view profile
    //http://localhost:3000/profile/5xxxxcxxxx
    router.get('/profile/:id', function(req, res)
    {
        var id = req.params.id;
        db.getCustomerById(id, function (err, customer) {
            if (err) {
                res.status(500).send("Unable to find a customer with this id");
            } else {
                res.status(200).send(customer);
            }
        });
    });

    router.put('/profile', function (req, res) {
        var data = req.body;
        db.updateCustomer(data.id, data.username, data.email, data.mobilenumber, data.creditcard, data.password,
             function (err, customer) {
            res.end();
        });

    });

    router.post('/favourites', function(req, res){
        var title = req.body.title;
        var genre = req.body.genre;

        db.addFavourite(title, genre, function(err,favourite)
            {
                if (err) {
                    res.status(500).send("Unable to add");
                } else {
                    res.redirect('/favourite');
            }
        })
         
    });
    return router;
};
module.exports = routes();