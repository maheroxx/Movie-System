var mongoose = require('mongoose');
var schema = mongoose.Schema;
var customerSchema = {};
var movieSchema = {};
var favouriteSchema ={};
var historySchema = {};
var customerModel, movieModel, favouriteModel, historyModel;

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
                    genre: String,
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
                })
                var connection = mongoose.connection;
                customerModel = connection.model("customers", customerSchema)
                movieModel = connection.model("movies", movieSchema);
                favouriteModel = connection.model("favourite", favouriteSchema);
                historyModel = connection.model("history", historySchema);
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

    addFavourite: function(t, g, cid, callback){
        var newFavourite = new favouriteModel({
            title: t,
            genre: g,
            customer: cid
        });
        newFavourite.save(callback);
    },

    addHistory: function(t,cid,callback)
    {
        var newHistory = new historyModel({
            movie: t,
            customer: cid
        });
        newHistory.save(callback);
    },
   
    getHistorybyId: function(id, callback)
    {
        historyModel.find({customer: id},{_id:0}).populate('customer','_id').exec(callback);
    }
};

module.exports = database;
