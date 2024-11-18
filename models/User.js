const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['Ops User','Client User'],
        required:true
    },
    email_verified:{
        type:Boolean,
        default:false
    }
})

const UserModel = mongoose.models.User || mongoose.model("User",UserSchema)
module.exports = UserModel;