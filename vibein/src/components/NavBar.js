import React, {useContext, useRef, useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {UserContext} from '../App';
import M from 'materialize-css';
//creating navigation bar for VibeIn
const NavBar = ()=> {
    const searchModal = useRef(null);
    const [search,setSearch] = useState("");
    const [userDetails,setUserDetails] = useState([]);
    const {state, dispatch} = useContext(UserContext);
    const history = useHistory();
    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[]);
    const renderList = ()=>{
        if(state){
            return [
            <li key = "1"><i data-target="modal1" className ="large material-icons modal-trigger" style = {{color:"whitesmoke" ,cursor :"pointer"}}>search</i></li>,
            <li key = "2"><Link to="/profile">Profile</Link></li>,
            <li key = "3"><Link to="/createpost">Create Post</Link></li>,
            <li key = "4"><Link to="/myfollowingposts">Following Posts</Link></li>,
            <li key = "5">
                  <button className = "btn  #00695c teal darken-3" 
                  onClick = {()=>{
                   localStorage.clear()
                   dispatch({type:"CLEAR"})
                   history.push('/signin');
                  }}>
                      LogOut🔐</button>

            </li>
            ];
        }else{
            return [
                <li key = "6"><Link to="/signin">SignIn</Link></li>,
                <li key = "7"><Link to="/signup">SignUp</Link></li>   
            ];
        }
    };

    const fetchUsers = (query)=>{
        setSearch(query)
        fetch('/search_users',{
            method: "post",
            headers:{
                "Content-Type" : "application/json"
            },
            body:JSON.stringify({
                query
            })
        }).then(res=>res.json())
        .then(results=>{
            setUserDetails(results.user)
        })
    };
    return (
        <nav>
            <div className="nav-wrapper #009688 teal">
                <Link to= {state ? "/" : "/signin"} className="brand-logo left">VibeIn <small className='brand-tag'> : Connect Your Vibes!</small></Link>
                <ul id="nav-mobile" className="right">
                   {renderList()}
                </ul>
            </div>
            <div id="modal1" className ="modal" ref = {searchModal} >
                <div className ="modal-content" style = {{color : "black"}}>
                <input type = 'text' placeholder = 'Search Users' value = {search} onChange = {(e)=> fetchUsers(e.target.value)}/> 
                <ul className = "collection">
                    {userDetails.map(item=>{
                        return <Link to = { item._id !== state._id ?"/profile/"+item._id: '/profile'} onClick={()=>{
                            M.Modal.getInstance(searchModal.current).close();
                            setSearch('');
                        }}><li className = "collection-item">{item.name}</li></Link>
                    })}  
                </ul>
                </div>
                <div className ="modal-footer" >
                <button className ="modal-close waves-effect waves-green btn-flat #009688 teal x" onClick={()=>setSearch('')}>Exit</ button>
                </div>
            </div>
        </nav>

    );
}
export default NavBar;