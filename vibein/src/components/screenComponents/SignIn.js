import React, {useState, useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {UserContext} from '../../App';
import M from 'materialize-css';
const SignIn = ()=>{
  const {state,dispatch} = useContext(UserContext);
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const PostData = ()=>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
       M.toast({html: "Invalid Email ID :/", classes:"#ff8a65 deep-orange lighten-2"})
       return;
      }
    fetch("/sign_in", {
      method : "post", 
      headers : {
        "Content-Type" : "application/json",
       
      },
      body : JSON.stringify({
        password ,
        email ,
      })
    }).then(res=>res.json())
    .then(data =>{
      console.log(data)
        if(data.error){
          M.toast({html: data.error, classes:"#ff8a65 deep-orange lighten-2"})
        }
        else{
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({type : "USER", payload : data.user});
          M.toast({html:"Signed In Successfully :D", classes: "#4caf50 green"})
          history.push('/');
        }
    }).catch(err=>{
      console.log(err)
    })
  }
    return(
      <div className = 'Mycard'>
          <div className = 'card medium auth-card'>
               <h2 >VibeIn</h2>
               <h5 className = 'brand-tag'>Connect Your Vibes!</h5>
               <input type = 'text' placeholder = 'Email' value = {email} onChange = {(e)=> setEmail(e.target.value)}/> 
               <input type = 'password' placeholder = 'Password' value = {password} onChange = {(e)=> setPassword(e.target.value)}/><br/><br/>
               <button className = "btn waves-effect waves-light #00695c teal darken-3" onClick = {()=> PostData()}>LogIn 🔓 </button><br/>
               <h5><Link to = '/signup' className = 'link '>Don't have an account? 🤨</Link></h5>
          </div>
      </div>
    )
};

export default SignIn;