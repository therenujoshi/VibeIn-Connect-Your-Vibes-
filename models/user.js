const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;


// Creating user schema

const user_Schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    pic:{
        type : String,
        default:"https://res.cloudinary.com/cloudvibein/image/upload/v1610179751/no_img_wyxxtm.png"
    },
    connectors:[{type : ObjectId,ref : "UserSchema"}],
    following:[{type : ObjectId,ref : "UserSchema"}],

});

mongoose.model("UserSchema",user_Schema);