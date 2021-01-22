import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../../App';

const Profile =()=>{
    const [mypics,setPics] = useState([]);
    const {state, dispatch} = useContext(UserContext);
    const [image,setImage] = useState("");
   // const [url,setUrl] = useState("");
    useEffect(()=>{
        fetch('/my_posts',{
            headers:{
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json()) 
        .then (result=>{
            setPics(result.mypost);
        })
    }, []);
    useEffect(()=>{
            if(image){
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
                  //  localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
                  //  dispatch({type:"UPDATEPIC", payload:data.url})
                   fetch('/updatepic',{
                       method:"put",
                       headers:{
                           "Content-Type" : "application/json",
                           "Authorization" : "Bearer "+localStorage.getItem("jwt")
                       },
                       body:JSON.stringify({
                           pic:data.url
                       })

                   }).then(res=>res.json())
                   .then(result=>{
                       console.log(result)
                       localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                       dispatch({type:"UPDATEPIC", payload:result.pic})
                      // window.location.reload();
                    })
                  
                })
                .catch(err=>{
                    console.log(err);
                })
            }
    },[image])
    const updateDP=(file)=>{
           setImage(file)
          
          
    }
    return (
        <div style= {{ maxWidth : "650px", margin : "0px auto"}}>
            
            <div className = "transparentbox" style = {{
                display: "flex", justifyContent : "space-around", margin : "20px 0px", borderBottom : "2px solid #80cbc4 teal lighten-3" , 
             }}>
                 
                <div >
                        <img style={{ width: "160px", height: "160px", borderRadius: "80px", padding: "10px" }} src={state?state.pic:"Loading..."} />
                        <div style = {{
                                margin : "20px 0px", borderBottom : "2px solid #80cbc4 teal lighten-3" , 
                                    }}>
                            
                            <div className ="file-field input-field" style = {{margin :"10px"}}>

                            <div className ="btn #00897b teal darken-1">
                                <span>Edit DP 📷</span>
                                <input type="file" onChange = {(e)=> updateDP(e.target.files[0])}/>
                            </div>
                            <div className ="file-path-wrapper">
                                <input className ="file-path validate" type="text"/>
                            </div>

                            </div>

                        </div>
                </div>
                
                   
                        <div style = {{padding : "30px"}}>
                            <center>
                            <h4> {state?state.name:"loading"}</h4>
                            <h6> {state?state.email:"loading"}</h6>
                            <div style = {{ display : "flex", justifyContent : "space-between", width : "110%"}}>
                            <h6>Posts : {mypics.length}</h6>
                            <h6>Connectors : {state?state.connectors.length:"0"}</h6>
                            <h6>Following : {state?state.following.length:"0"}</h6>
                            </div>
                            </center>
                        </div>
                  
                

            </div>
            <div className = "gallery">
                {
                    mypics.map(item=>{
                        return(
                            <img key = {item._id} className = "items" src = {item.photo} alt = {item.title}/>
  
                        )
                    })
                }
                    
                    
            </div>
        </div>
    );
};

export default Profile; 