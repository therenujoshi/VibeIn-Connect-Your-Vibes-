import React, {useState, useContext} from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import {UserContext} from '../../App';
import M from 'materialize-css';
const SignIn = ()=>{
  const history = useHistory();
  const [password, setPassword] = useState("");
  const {token} = useParams();
  console.log(token);
  const PostData = ()=>{
    fetch("/new_password", {
      method : "post", 
      headers : {
        "Content-Type" : "application/json",
       
      },
      body : JSON.stringify({
        password , token
      })
    }).then(res=>res.json())
    .then(data =>{
      console.log(data)
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
               <input type = 'password' placeholder = 'Enter A New Password' value = {password} onChange = {(e)=> setPassword(e.target.value)}/><br/><br/>
               <button className = "btn waves-effect waves-light #00695c teal darken-3" onClick = {()=> PostData()}>Update Password </button><br/>
          </div>
      </div>
    )
};

export default SignIn;