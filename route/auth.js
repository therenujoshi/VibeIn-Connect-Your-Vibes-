const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('UserSchema');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_Secret} = require('../config/passkeys');
const requireLogIn = require('../middleware/requireLogIn');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {SENDGRID_API,EMAIL} = require('../config/passkeys')
//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

//for sending email confirmation
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
     
        api_key:SENDGRID_API
    }
}));


// TESTING PURPOSE

//allowing signed_in user to access protected areas by matching token 
/*router.get('/protected',requireLogIn,(req,res)=>{
    res.send("Helloww User.");
});*/


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
                transporter.sendMail({
                    to:user.email,
                    from:"noreply.vibein@gmail.com",
                    subject: "Signed Up Successfully :D",
                    html:"<h1>Welcome to VibeIn Family!</h1> <h3>Hope you will connect your vibes with the world. ;)</h3>"
                })
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

//forget password - using crypto of nodejs to generate unique token
router.post('/reset_password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        //buffer returns token in hex code
        const token = buffer.toString("hex");
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User doesn't exists with that email"})
            }
            user.resetToken = token;
            user.expireToken = Date.now() + 3600000;
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"noreply.vibein@gmail.com",
                    subject:"Reset Password",
                    html:`
                    <p>You requested to reset your VibeIn account password</p>
                    <h5>Click on this <a href = "${EMAIL}/reset/${token}">link</a> to reset your password</h5>`
                })
                res.json({message:"Check your email."});
            })
        })
    })
});

router.post('/new_password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again. Session expired :/"})
        }
        bcrypt.hash(newPassword,10).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"Password Updation Success!"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})



module.exports = router;