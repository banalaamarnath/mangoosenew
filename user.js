var mongoose = require("mongoose");
var schema =  mongoose.Schema({
    name: {type:String},
    age:{type:String},
    email: {type:String},
    gender: {type:String}
});

var user = mongoose.model('users', schema);
module.exports={user};
//module.exports = schema;