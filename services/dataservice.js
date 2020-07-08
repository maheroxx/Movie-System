var mongoose = require('mongoose');
var schema = mongoose.Schema;

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
                var connection = mongoose.connection;
                movieModel = connection.model("Movie", movieSchema);
            } else {
                console.log("Error connecting to Mongo DB");
            }
        })
    },

};

module.exports = database;
