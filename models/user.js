const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type:String,
        require:true
    }
});

UserSchema.plugin(passportLocalMongoose);
// passport will take "username" and "password" keys by default
// so no need to set both at schema

module.exports=mongoose.model('User',UserSchema);
