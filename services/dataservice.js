var mongoose = require('mongoose');
var schema = mongoose.Schema;
var customerSchema = {};
var movieSchema = {};
var favouriteSchema ={};
var historySchema = {};
var checkoutSchema = {};
var customerModel, movieModel, favouriteModel, historyModel, checkoutModel;

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
                    movie: String,
                    customer: {
                        type: schema.Types.ObjectId,
                        ref: 'customers'
                    }
                });

                historySchema = schema({
                   movie: String,
                    customer: {
                        type: schema.Types.ObjectId,
                        ref: 'customers'
                    }
                });

                checkoutSchema = schema({
                    customer: {
                        type: schema.Types.ObjectId,
                        ref: 'customers'
                    },
                    price: String
                })


                var connection = mongoose.connection;
                customerModel = connection.model("customers", customerSchema)
                movieModel = connection.model("movies", movieSchema);
                favouriteModel = connection.model("favourite", favouriteSchema);
                historyModel = connection.model("history", historySchema);
                checkoutModel = connection.model("checkout", checkoutSchema);
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
    getMovieById : function(id, callback){
        movieModel.findById(id,callback);
    },
    searchMovie: function(t,callback) {
        movieModel.find({title: new RegExp(t,'i')},callback);
    },

    addFavourite: function(t, cid, callback){
        var newFavourite = new favouriteModel({
            movie: t,
            customer: cid
        });
        newFavourite.save(callback);
    },

    getFavourite: function( callback)
    {
        favouriteModel.find({}).populate('customer').exec(callback);
    },

    addHistory: function(t,cid,callback)
    {
        var newHistory = new historyModel({
            movie: t,
            customer: cid
        });
        newHistory.save(callback);
    },
   
    getHistory: function(callback)
    {
        historyModel.find({}).populate('customer').exec(callback);
    },

    checkout: function(cid, p, callback)
    {
        var newCheckout = new checkoutModel(
        {
            customer: cid,
            price : p

        });
        newCheckout.save(callback);
    },
};

module.exports = database;
