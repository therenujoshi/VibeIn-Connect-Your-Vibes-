const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogIn = require('../middleware/requireLogIn');
const Post = mongoose.model("PostSchema");
const User = mongoose.model("UserSchema");

router.get('/user/:id',requireLogIn, (req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user,posts})
        })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})

//follow
router.put('/connect',requireLogIn,(req,res)=>{
    User.findByIdAndUpdate(req.body.connectId,{
        $push:{connectors:req.user._id}
    },{
        new : true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.connectId}
        },{new : true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    });
})


//unfollow
router.put('/disconnect',requireLogIn,(req,res)=>{
    User.findByIdAndUpdate(req.body.disconnectId,{
        $pull:{connectors:req.user._id}
    },{
        new : true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.disconnectId}
        },{new : true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    });
})
router.put('/updatepic',requireLogIn,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
         if(err){
             return res.status(422).json({error:"Cannot Update :/"})
         }
         res.json(result);
    })
})

router.post('/search_users',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({name:{$regex:userPattern}})
    .select("_id name")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })

})

module.exports = router;