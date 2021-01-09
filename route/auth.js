const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('UserSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_Secret} = require('../config/passkeys');
const requireLogIn = require('../middleware/requireLogIn');



// TESTING PURPOSE

//allowing signed_in user to access protected areas by matching token 
router.get('/protected',requireLogIn,(req,res)=>{
    res.send("Helloww User.");
});


//creating sign_up auth using router
router.post('/sign_up',(req,res)=>{
 const {name,email,password,pic} = req.body
    if(!name || !email || !password){
       return res.status(422).json({error:"Please enter all the fields."});
    }

    //matching user details with the database
   User.findOne({email:email})
   .then((savedUser)=>{
       if(savedUser){
        return res.status(422).json({error:"Oops! User already exists with that email :("});
       }
       //password encryption
       bcrypt.hash(password,10)
       .then(hashedPassword=>{
            const user = new User({
                name,
                email,
                password:hashedPassword,
                pic
            })
 
            user.save()
            .then(user=>{
                res.json({message:"Signed Up Successfully! ^_^"});
            })
            .catch(err=>{
                 console.log(err);
            })
       })
      
   })
   .catch(err=>{
    console.log(err);
 });


});

//creating sign_in auth using router
router.post('/sign_in',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        res.status(422).json({error:"Please enter required field(s)."});
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid credential(s)."});
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
              //  res.json({message:"Hurray! Signed in Successfully."});
             //creating token using jwt for signed in user  
              const token = jwt.sign({_id:savedUser._id},JWT_Secret);
              const{_id, name,email,connectors,following,pic} = savedUser
              res.json({token, user:{_id, name, email,connectors,following,pic}});
            }
            else{
                return res.status(422).json({error:"Invalid credential(s)."});
            }

        })
        .catch(err=>{
            console.log(err);
        })
    })
});


module.exports = router;