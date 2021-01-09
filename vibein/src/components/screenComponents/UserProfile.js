import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../../App';
import {useParams} from 'react-router-dom';
const Profile =()=>{
    const [userProfile,setProfile] = useState(null);
    const {state, dispatch} = useContext(UserContext);
    const {userid} = useParams();
    const [showconnect, setShowConnect]= useState(state?!state.following.includes(userid):true);

    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json()) 
        .then (result=>{
            //console.log(result);
            
            setProfile(result);
        })
    }, []);

    //follow user
    const connectUser = ()=>{
        fetch('/connect',{
            method : "put",
            headers : {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer "+ localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            connectId: userid
        })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE", payload:{following:data.following, connectors:data.connectors}})
            localStorage.setItem("user", JSON.stringify(data));
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        connectors:[...prevState.user.connectors, data._id]
                    }
                }
            });
            setShowConnect(false)
        })
    }

    //unfollow user
    const disconnectUser = ()=>{
        fetch('/disconnect',{
            method : "put",
            headers : {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer "+ localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            disconnectId: userid
        })
        }).then(res=>res.json())
        .then(data=>{

            dispatch({type:"UPDATE", payload:{following:data.following, connectors:data.connectors}})
            localStorage.setItem("user", JSON.stringify(data));
           
            setProfile((prevState)=>{
                const newConnector = prevState.user.connectors.filter(item=>item!= data._id)
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        connectors:newConnector
                    }
                }
            });
            setShowConnect(true);
            
        })
    }

    return (
        <>
        {userProfile? 
        <div style= {{ maxWidth : "650px", margin : "0px auto"}}>
            
        <div className = "transparentbox" style = {{
            display: "flex", justifyContent : "space-around", margin : "20px 0px", borderBottom : "2px solid #80cbc4 teal lighten-3" , 
         }}>
            <div >
                <img style={{ width: "160px", height: "160px", borderRadius: "80px", padding: "10px" }} src={userProfile.user.pic} alt=" Dana_Scott_image" />
            </div>
            <div >
                <center>
                <h4> {userProfile.user.name}</h4>
                <h6> {userProfile.user.email}</h6>
                <div style = {{ display : "flex", justifyContent : "space-between", width : "110%"}}>
                <h6>Posts : {userProfile.posts.length}</h6>
                <h6>Connectors : {userProfile.user.connectors.length}</h6>
                <h6>Following : {userProfile.user.following.length}</h6>
                </div>
                {showconnect?
                    <button style = {{margin : "20px"}} className = "btn-small waves-effect waves-light #00695c teal darken-3" 
                    onClick = {()=> connectUser()}>Connect👥</button>
                    :
                    <button style = {{margin : "20px"}} className = "btn-small waves-effect waves-light #00695c teal darken-3" 
                    onClick = {()=> disconnectUser()}>Disconnect👤</button>

                }<br/>
                </center>
            </div>
            
        </div>
        { <div className = "gallery">
            {
                userProfile.posts.map(item=>{
                    return(
                        <img key = {item._id} className = "items" src = {item.photo} alt = {item.title}/>

                    )
                })
            }
                
                
        </div> }
        
    </div>
        : <h2 className= "transparentbox">Loading...🔃</h2>}
        
        </>
    );
};

export default Profile; 