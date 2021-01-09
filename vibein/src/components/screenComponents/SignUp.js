import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';
const SignUp = ()=>{
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image,setImage] = useState("");
  const [url,setUrl] = useState(undefined);
  
  useEffect(()=>{
      if(url){
        uploadFields();
      }
  },[url])
  const UploadPic=()=>{
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset","VibeIn");
    data.append("cloud_name","cloudvibein");
    fetch("https://api.cloudinary.com/v1_1/cloudvibein/image/upload",{
        method : "post",
        body : data
    })
    .then(res=>res.json())
    .then(data=>{  
        setUrl(data.url);
    })
    .catch(err=>{
        console.log(err);
    })
  }
  const uploadFields=()=>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      M.toast({html: "Invalid Email ID :/", classes:"#ff8a65 deep-orange lighten-2"})
      return;
     }
   fetch("/sign_up", {
     method : "post", headers : {
       "Content-Type" : "application/json"
     },
     body : JSON.stringify({
       name ,
       password ,
       email ,
       pic:url
     })
   }).then(res=>res.json())
   .then(data =>{
       if(data.error){
         M.toast({html: data.error, classes:"#ff8a65 deep-orange lighten-2"})
       }
       else{
         M.toast({html:data.message, classes: "#4caf50 green"})
         history.push('/signin');
       }
   }).catch(err=>{
     console.log(err)
   })
  }
  const PostData = ()=>{
    if(image){
      UploadPic();
    }else{
    uploadFields();
    }
    
  };

    return(
      <div className = 'Mycard'>
          <div className = 'card large auth-card'>
               <h2 className = 'brand-logo'>VibeIn</h2>
               <h5 className = 'brand-tag'>Connect Your Vibes!</h5>
               <input type = 'text' placeholder = 'Username' value = {name} onChange = {(e)=> setName(e.target.value)}/>
               <input type = 'text' placeholder = 'Email' value = {email} onChange = {(e)=> setEmail(e.target.value)}/> 
               <input type = 'password' placeholder = 'Password' value = {password} onChange = {(e)=> setPassword(e.target.value)}/><br/>
               <div className ="file-field input-field">
                    <div className ="btn #00897b teal darken-1">
                         <span>Upload Profile Picture 📤</span>
                         <input type="file" onChange = {(e)=> setImage(e.target.files[0])}/>
                    </div>
                    <div className ="file-path-wrapper">
                        <input className ="file-path validate" type="text"/>
                    </div>
                </div>
               <button className = "btn waves-effect waves-light #00695c teal darken-3" onClick ={()=>PostData()}>SignUp 🔗 </button><br/>
               <h5 style={{marginBottom:"10px"}}><Link to = '/signin' className = 'link' >Already have an account? 🤔</Link></h5>
          </div>
      </div>
    )
};

export default SignUp;