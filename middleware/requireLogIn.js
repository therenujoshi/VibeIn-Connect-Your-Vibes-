//creating a middleware to verify token
const jwt = require('jsonwebtoken');
const {JWT_Secret} = require('../config/passkeys');
const mongoose = require('mongoose');
const User = mongoose.model('UserSchema');

module.exports = (req,res,next)=>{
     const {authorization} = req.headers;
    //authorization === Bearer <token>
    if(!authorization){
        return res.status(401).json({error:"Oh! You must be logged in :/"});
    }

    const token = authorization.replace("Bearer ","");
    jwt.verify(token,JWT_Secret,(err,payload)=>{
        if(err){
            console.log(err);
            return res.status(401).json({error:"Oh! You must be logged in :/"});
        }

        //destructuring id using payload
        const {_id} = payload;
        User.findById(_id).then(userData=>{
            req.user = userData;
            next();
        });
       

    });
}