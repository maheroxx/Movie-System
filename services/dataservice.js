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
                movieModel = connection.model("Movie", movieSchema);
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
        customerModel.findOne({username: u}, {password: p},callback);
    },

};

module.exports = database;
