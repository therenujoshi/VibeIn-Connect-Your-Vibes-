import React, {useEffect, createContext, useReducer, useContext} from 'react' ;
import NavBar from './components/NavBar';
import './App.css';
import {BrowserRouter,Route, Switch, useHistory} from 'react-router-dom';
import Home from './components/screenComponents/Home.js';
import SignIn from './components/screenComponents/SignIn.js';
import SignUp from './components/screenComponents/SignUp.js';
import Profile from './components/screenComponents/Profile.js';
import CreatePost from './components/screenComponents/CreatePost.js';
import UserProfile from './components/screenComponents/UserProfile.js';
import FollowUserPosts from './components/screenComponents/FollowUserPosts.js';
import {reducer, initialState} from './reducers/userReducers.js';
export const UserContext = createContext();

const Routing = ()=>{
      const history = useHistory();
      const {state, dispatch} = useContext(UserContext);
      useEffect(()=>{
            const user = JSON.parse(localStorage.getItem("user"));
            if(user){
                  dispatch({type : "USER", payload : user});
                  //history.push('/');
            }else{
                  history.push('/signin');
            }
      },[]);
   return(
      <Switch>
            <Route exact path="/" >
            <Home />
            </Route>
            <Route path="/signin" >
                  <SignIn />
            </Route>
            <Route path="/signup" >
                  <SignUp />
            </Route>
            <Route exact path="/profile" >
                  <Profile />
            </Route>
            <Route path="/createpost" >
                  <CreatePost />
            </Route>
            <Route path="/profile/:userid" >
                  <UserProfile />
            </Route>
            <Route path="/myfollowingposts" >
                  <FollowUserPosts />
            </Route>
      </Switch>

)
}

function App() {
      const [state, dispatch] = useReducer(reducer,initialState);
  return (
      <UserContext.Provider value = {{state, dispatch}}>
            <BrowserRouter>
                  <NavBar />
                  <Routing/>
            </BrowserRouter>
      </UserContext.Provider>
  );
}

export default App;
