var bodyParser = require('body-parser');
var db = require('./services/dataservice.js');
var crypto = require('crypto');

db.connect();

var routes = function () {
    var router = require('express').Router();
    
    router.use(bodyParser.urlencoded({
        extended: true
    }));
    
    router.use(function(req,res,next){
        //only check for token if it is PUT, DELETE methods or it is POSTING to events
        if((req.method=="POST" && req.url.includes("/favourite"))||
             (req.method=="POST" && req.url.includes("/history"))) {
            var token = req.query.token;
            if (token == undefined) {
                res.status(401).send("No tokens are provided. You are not allowed to perform this action.");
            } else {
                db.checkToken(token, function (err, customer) {
                    if (err || customer == null) {
                        res.status(401).send("[Invalid token] You are not allowed to perform this action.");
                    } else {
                        //means proceed on with the request.
                        res.locals.customer= customer;
                        next();
                    }
                });
            }
        } else {    //all other routes will pass
            next();
        }
    });
    
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

    //view history
    router.get('/history', function(req, res) {
        res.sendFile(__dirname+"/views/history.html");
    });

    router.get('/moviepage', function(req,res)
    {
        res.sendFile(__dirname+"/views/movie.html");
    })

    //view favourite
    router.get('/favourite', function(req, res) {
        res.sendFile(__dirname+"/views/favourite.html");
    });

    //search movies
    router.get('/search', function(req, res) {
        res.sendFile(__dirname+"/views/search.html");
    });

    router.post('/search', function(req,res)
    {   var title = req.body.title;
        db.searchMovie(title,function(err,movies)
        {
            if(err)
            {
                res.status(500).send("Unable to find the movie")
            }
            else
            {
                res.status(200).send(movies)
            }
            
        })
    })

    // add customer to the database
    router.post('/register', function(req, res){
        var username = req.body.username;
        var email = req.body.email;
        var mobilenumber = req.body.mobilenumber;
        var password =req.body.password;
        //var confirmpass = req.body.confirmpass;
        var creditcard = req.body.creditcard;

      
        db.addCustomer(username,email,mobilenumber,creditcard,password
            ,function(err,customer)
            {
                if (err) {
                    res.status(500).send("Unable to register");
                } else {
                    res.status(200).send("Register successful!")
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
                      
                        res.status(200).json({ 'message': 'Login successful.', 'token': token });
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
                   db.updateToken(customer._id, "",function(err, customer){
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
            if(err)
            {
                res.status(500).send("Unable to get all the movies")

            }
            else{
            res.status(200).send(movies);
            }
        })
        
    });
    //display each movie by ID 
    router.get('/movie/:id',function(req,res){
        var id = req.params.id;
        db.getMovieById(id, function(err, movie){
            if (err) {
                res.status(500).send("Unable to find a movie with this id");
            } else {
            res.send(movie);
            }
    })
    });
    //display customer's information 
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

    //update customer's information
    router.put('/profile', function (req, res) {
        var data = req.body;
        db.updateCustomer(data.id, data.username, data.email, data.mobilenumber, data.creditcard, data.password,
             function (err, customer) {
                 if(err)
                 {
                     res.status(500).send("Unable to update the changes")
                 }
                 else
                 {
                     res.status(200).send("Update successful")
                     res.send(customer);
                 }
            res.end();
        });

    });


    // add to favourite
    router.post('/favourite', function(req,res)
    {  
        var data = req.body;
        var customerId = res.locals.customer._id;
       
        db.addFavourite(data.movie, customerId,function(err, favourite){
            if (err) {
                res.status(500).send("Unable to add to Favourite");
                console.log(err);
            } else {
                res.status(200).send("Movie successfully added to Favourite!");
            }
        })
    });

    router.get('/favourite/:customer',function(res,req){
        var id = req.params.customer;
        db.getFavouritebyId(id, function(err,customer){
            if (err) {
                res.status(500).send("Unable to get Favourite.");
            } else {
                res.status(200).send(customer);
            } 
        })
    })

    // add movie to the history list
    router.post('/history', function(req,res)
    {  
        var data = req.body;
        var customerId = res.locals.customer._id;
       
        db.addHistory(data.movie, customerId,function(err, history){
            if (err) {
                res.status(500).send("Unable to add a new history");
                console.log(err);
            } else {
                res.status(200).send("Movie has been successfully added to History List!");
            }
        })
    });

    router.get('/historylist',function(req,res){
       // var customerid = req.body.id;
        db.getHistory( function(err,customer){
            if (err) {
                res.status(500).send("Unable to get all the history.");
                console.log(err)
            } else {
                res.status(200).send(customer);
            } 
        })
    })
    return router;
};
module.exports = routes();