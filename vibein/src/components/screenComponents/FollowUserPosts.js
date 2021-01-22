import React, {useState, useEffect, useContext} from 'react';
import {UserContext} from '../../App';
import {Link} from 'react-router-dom';
const Home = ()=>{
    const [data, setData] = useState([]);
    const {state, dispatch} = useContext(UserContext);
    useEffect (()=>{
        fetch('/getfollowpost',{
            headers:{
                "Authorization" : "Bearer "+ localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            //uconsole.log(result);
            setData(result.posts);
        })
    },[])
    const likePost = (id)=>{
            fetch('/like',{
                method : "put",
                headers : {
                    "Content-Type": "application/json",
                    "Authorization" : "Bearer "+ localStorage.getItem("jwt")
                },
                body : JSON.stringify({
                    postId : id
                })
            }).then(res=>res.json())
            .then(result=>{
                //console.log(result);
                const newData = data.map(item=>{
                    if(item._id == result._id){
                        return result;
                    }else{
                        return item;
                    }
                 })
                 setData(newData)
            }).catch(err=>{
                console.log(err);
            })

            
    };
    const unlikePost = (id)=>{
            fetch('/unlike',{
                method : "put",
                headers : {
                    "Content-Type": "application/json",
                    "Authorization" : "Bearer "+ localStorage.getItem("jwt")
                },
                body : JSON.stringify({
                    postId : id
                })
            }).then(res=>res.json())
            .then(result=>{
                //console.log(result);
                const newData = data.map(item=>{
                    if(item._id == result._id){
                        return result;
                    }else{
                        return item;
                    }
                 })
                 setData(newData)

                }).catch(err=>{
                    console.log(err);
                })
     }

     const makeComment = (text,postId)=>{
        fetch('/comment',{
            method : "put",
            headers:{
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+ localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                postId,
                text
            })

        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item=>{
                if(item._id == result._id){
                    return result;
                }else{
                    return item;
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err);
        })

     }; 
     const deletePost = (postid)=>{
         fetch(`/deletepost/${postid}`,{
             method : "delete",
             headers : {
                 Authorization : "Bearer "+ localStorage.getItem("jwt")
             }
         }).then(res=>res.json())
         .then(result=>{
             console.log(result);
             const newData = data.filter(item =>{
                 return item._id !== result._id;
             })
             setData(newData);
         })
     };
     /*const deleteComment = (postid)=>{
        fetch(`/deletecomment/${postid}`,{
            method : "delete",
            headers : {
                Authorization : "Bearer "+ localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
            const newData = data.filter(item =>{
                return item._id !== result._id;
            })
            setData(newData);
        })
    };*/
    return(
        <div>
            {
                data.map(item=>{
                    return (
                        <div className = "card home_card" key={item._id}>

                            <h5 style = {{padding : "10px"}}><Link to = {item.postedBy._id !== state._id?"/profile/"+item.postedBy._id : "/profile" }>{item.postedBy.name}</Link>{item.postedBy._id==state._id && <i className = "material-icons" style ={{float : "right", cursor : "pointer"}}
                            onClick = {()=>deletePost(item._id)}>delete</i>}</h5>
                            <div className = "card-image">
                                <img src = {item.photo} />
                            </div>
                            <div className = "card-content">
                                {item.likes.includes(state._id)?                            
                                    <i  className = "fa material-icons" onClick={()=>{unlikePost(item._id)}}>favorite</i>
                                    :                            
                                    <i  className = "fa material-icons" onClick={()=>{likePost(item._id)}}>favorite_border </i>
                                }
                                
                                
                                <h6>{item.likes.length} Likes</h6>
                                <h4>{item.title}</h4>
                                <h6>{item.body}</h6>
                                
                                {
                                    item.comments.map(record=>{
                                        return(
                                            <p key = {record._id}> <span style = {{ fontWeight : "500" }}>{record.postedBy.name} </span>{record.text} </p>
                                        )
                                    })
                                
                                } 
                                
                                
                                <form id = "myForm" onSubmit = {(e)=>{
                                     e.preventDefault()
                                     makeComment(e.target[0].value, item._id)
                                     
                                }}>
                                <input type = "text" placeholder = "Add a comment"/>
                                </form>
                               
                            </div>
                        </div>
                    ) 
                })
            }
           
       

        </div>
    )
};
      /*{record.postedBy._id==state._id && <i className = "material-icons" style ={{float : "right", cursor : "pointer" }}
                                              onClick = {()=>deleteComment(record._id)}>delete</i>} */
      
                                             
export default Home;
