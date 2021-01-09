const express = require('express');
const _ = require("lodash");
const app=express();
const port= process.env.PORT || 5000;

const mongoose = require('mongoose');
const{MongoDBURI} = require('./config/passkeys');



mongoose.connect(MongoDBURI,{
useNewUrlParser:true,
useUnifiedTopology:true
});
mongoose.connection.on('connected',()=>{
    console.log("Connected to MongoDB.")
});
mongoose.connection.on('error',(err)=>{
    console.log("Error while connecting!",err)
});

//using user schema <"UserSchema" = user_Schema>
require('./models/user');
//using post schema <"PostSchema" = post_Schema>
require('./models/post');

//passing to json middleware before routing 
app.use(express.json());

//using router for auth
app.use(require('./route/auth'));

//using router for post
app.use(require('./route/post'));
app.use(require('./route/user'));

/*
const customMiddleWare = (req,res,next)=>{
console.log("MiddleWare Executed.");
next();
};

app.use(customMiddleWare);

app.get('/',(req,res)=>{
    console.log("Home");
    res.send("Hello World");
});*/

if(process.env.NODE_ENV=="production"){
    app.use(express.static('vibein/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'vibein','build','index.html'))
    })
}

app.listen(port,()=>{
    console.log("Server is running on port:",port);
});