var mongoose = require('mongoose');
var schema = mongoose.Schema;
var customerSchema = {};
var customerModel;

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
                });

                var connection = mongoose.connection;
                customerModel = connection.model("customer", customerSchema)
                movieModel = connection.model("movies", movieSchema);
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

    getCustomer: function(u,p,callback)
    {
        customerModel.findOne({username: u,password: p},callback);
    },

    /*getCustomerInfo : function(callback)
    {
        customerModel.find({}, callback);
    },*/

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
    }

   
};

module.exports = database;
