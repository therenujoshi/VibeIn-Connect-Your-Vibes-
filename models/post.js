const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const post_Schema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required : true
    },
    likes:[{type : ObjectId, ref : "UserSchema"}],
    comments:[{
        text:String,
        postedBy: {type : ObjectId, ref : "UserSchema"}
    }],
    postedBy:{
        type:ObjectId, //id of user
        ref:"UserSchema"
    }
},{timestamps:true});

mongoose.model("PostSchema",post_Schema);
