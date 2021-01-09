const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogIn = require('../middleware/requireLogIn');
const Post = mongoose.model("PostSchema");

//for viewing all posts
router.get('/all_posts',requireLogIn,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy", "_id name")
    .then(posts=>{
        res.json({posts});
    })
    .catch(err=>{
        console.log(err);
    });
});
//for viewing posts of following list
router.get('/getfollowpost',requireLogIn,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy", "_id name")
    .then(posts=>{
        res.json({posts});
    })
    .catch(err=>{
        console.log(err);
    });
});


//for creating post
router.post('/create_post',requireLogIn,(req,res)=>{
    const {title,body,pic} = req.body;
    if(!title || !body || !pic){
       return  res.status(422).json({error:"Please enter all details."});
    }
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        photo : pic,
        postedBy:req.user
    });
    post.save().then(result=>{
        res.json({post:result});
    })
    .catch(err=>{
        console.log(err);
    })
});

//for viewing my posts
router.get('/my_posts',requireLogIn,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("PostedBy","_id name")
    .then(mypost=>{
        res.json({mypost});
    })
    .catch(err=>{
        console.log(err);
    });
});

//for likes 
router.put('/like',requireLogIn,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
       new:true 
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err});
        }else{
            res.json(result);
        }
    })

});
//for unlikes
router.put('/unlike',requireLogIn,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
       new:true 
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err});
        }else{
            res.json(result);
        }
    })

});
//for comments 
router.put('/comment',requireLogIn,(req,res)=>{
    
    const comment = {
        text : req.body.text,
        postedBy : req.user._id 
    };
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
       new:true 
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err});
        }else{
            res.json(result);
        }
    })

});

//delete comment

/*router.delete('/deletecomment/:postId',requireLogIn,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,comment)=>{
        if(err || !comment){
            return res.status(422).json({error:err})
        }
        if(comment.postedBy._id.toString() === req.user._id.toString()){
            comment.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })

});*/

//delete post
router.delete('/deletepost/:postId',requireLogIn,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })

});

module.exports = router;