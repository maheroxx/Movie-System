var bodyParser = require('body-parser');
var db = require('./services/dataservice.js');
<<<<<<< HEAD
=======
var passport		= 	require('passport');
var localStrategy	=	require('passport-local').Strategy;
//const customersController = require('./controllers/customerController.js');
>>>>>>> 5c2aa199d438a9f6429f03abcb256d65046cd57f

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
<<<<<<< HEAD
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

=======

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
    router.get('/profile', function(req, res) {
        res.sendFile(__dirname+"/views/profile.html");
    });

    // add customer to the database
    router.post('/register', function(req, res){
        var username = req.body.username;
        var email = req.body.email;
        var mobilenumber = req.body.mobilenumber;
        var password =req.body.password;
        var creditcard = req.body.creditcard;

       /* req.checkBody( 'email','Email Field is Required').notEmpty();
        req.checkBody('email','Email not Valid').isEmail();
        req.checkBody('username','Username Field is Required').notEmpty();
        req.checkBody('password','Password Field is Required').notEmpty();
	req.checkBody('confirmpassword','Passwords do not Match').equals(req.body.password);

    var errors = req.validationErrors();

        if(errors)
        {
            res.render('register',{
                errors 			: 	errors
              
                //confirmpassword : 	confirmpassword
            });
        }else
        {*/
        
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
    router.post('/loginform', passport.authenticate('local',{failureRedirect:'/login',failureFlash:'Invalid Username or Password'}), function(req,res) {

        //If Local Strategy Comes True
        console.log('Authentication Successful');
        req.flash('success','You are Logged In');
        res.redirect('/index_after_login');
    
    });

    router.get('/logout', function(req, res)
    {
        req.logOut();
        res.redirect('/');
    });

    //view profile
    router.get('/profile', function(req, res)
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

    router.put('/api/profile', function (req, res) {
        var data = req.body;
        db.updateCustomer(data.username, data.email, data.mobilenumber, data.creditcard, data.password, function (err, customer) {
            if (err) {
                res.status(500).send("Unable to update the profile");
            } else {
                if (customer == null || customer.n == 0) {
                    res.status(200).send("Nothing updated");
                } else {
                    res.status(200).send("Profile successfully updated");
                }
            }
        })

    });


    return router;
};
>>>>>>> 5c2aa199d438a9f6429f03abcb256d65046cd57f
module.exports = routes();