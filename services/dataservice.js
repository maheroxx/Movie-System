var mongoose = require('mongoose');
var schema = mongoose.Schema;
var customerSchema = {};
movieSchema = {};
var customerModel, movieModel;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

var database = {
    connect: function () {
        mongoose.connect('mongodb://localhost:27017/MoviesDB', function (err) {
            if (err == null) {
                console.log("Connected to Mongo DB");
                //initialize values
                movieSchema = schema({
                    title: String,
                    description: String,
                    genre: String,
                    language: String,
                    ranking: Number,
                    runningtime: String

                });

                customerSchema = schema({
                    username: String,
                    email: String,
                    mobilenumber: String,
                    creditcard: String,
                    password: String,
                    token: String
                });

                favouriteSchema = schema({
                    title: String,
                    genre: String
                });

                var connection = mongoose.connection;
                customerModel = connection.model("customer", customerSchema)
                movieModel = connection.model("movies", movieSchema);
                favouriteModel = connection.model("favourite", favouriteSchema);
            } else {
                console.log("Error connecting to Mongo DB");
            }
        })
    },

    addCustomer: function(u,e,m,c,p,callback)
    {
        var newCustomer = new customerModel({
            username: u,
            email: e,
            mobilenumber: m,
            creditcard: c,
            password: p
        });
        newCustomer.save(callback);
    },

    login: function(u,p,callback)
    {
        customerModel.findOne({username: u,password: p},callback);
    },
    updateToken: function(id, token,callback)
    {
        customerModel.findByIdAndUpdate(id,{token: token},callback);
    },
    checkToken: function(token,callback){
        customerModel.findOne({token: token},callback);
    },

    getCustomerInfo : function(callback)
    {
        customerModel.find({}, callback);
    },

    getCustomerById: function(id,callback){
        customerModel.findById(id,callback);
    },

    updateCustomer:function(id,u,e,m,c,p,callback){
        var updateOptions = {
            username: u,
            email: e,
            mobilenumber: m,
            creditcard: c,
            password: p
        }

        customerModel.findByIdAndUpdate(id,updateOptions,callback);
    },
    
    getMovies: function(callback){
        movieModel.find({}, callback);
    },
    
<<<<<<< HEAD
    searchMovie: function(t,callback) {
=======
    searchMovies: function(t,callback) {
>>>>>>> 453a1c85deda41dc1cf76ace9121effc725dceca
        movieModel.find({title: new RegExp(t,'i')},callback);
    },

    addFavourite: function(t, g, callback){
        var newFavourite = new favouriteModel({
            title: t,
            genre: g
        });
        newFavourite.save(callback);
    }
   
};

module.exports = database;
