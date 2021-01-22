import React, {useState, useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';
const Reset = ()=>{
  const history = useHistory();
  const [email, setEmail] = useState("");
  const PswdData = ()=>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
       M.toast({html: "Invalid Email ID :/", classes:"#ff8a65 deep-orange lighten-2"})
       return;
      }
    fetch("/reset_password", {
      method : "post", 
      headers : {
        "Content-Type" : "application/json",
       
      },
      body : JSON.stringify({
        email ,
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
    return(
      <div className = 'Mycard'>
          <div className = 'card small auth-card'>
               <h2 >VibeIn</h2>
               <h5 className = 'brand-tag'>Connect Your Vibes!</h5>
               <input type = 'text' placeholder = 'Email' value = {email} onChange = {(e)=> setEmail(e.target.value)}/> 
               <br/><br/>
            
               <button className = "btn waves-effect waves-light #00695c teal darken-3" onClick = {()=> PswdData()}>Reset Password🔑</button><br/>
          </div>
      </div>
    )
};

export default Reset;