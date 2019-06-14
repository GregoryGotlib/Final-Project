import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route , Switch } from 'react-router-dom';
import { setDecodedUser } from './actions/authAction';
import Footer from './components/base/Footer';
import Navbar from './components/base/Navbar'
import store from './store';
import Home from './components/base/Home';
import Register from './components/user/Register';
import Login from './components/user/Login';
import jwt_decode from 'jwt-decode';
import PrivateRoute from './utilities/privateRoute';
import setAuth from './utilities/setAuth';
import Dashboard from './components/user/Dashboard';
import ProfileDash from './components/profile/ProfileDash';
import CreateProfile from './components/profile/CreateProfile';
import Profile from './components/profile/Profile';
import EditProfile from './components/profile/EditProfile';
import SearchHistory from './components/profile/SearchHistory';
import './App.css';
import SearchProtein from './components/user/SearchProtein';
import ShowData from './components/profile/ShowData';



// in case we have token
if(localStorage.userToken){
  setAuth(localStorage.userToken);

  //Decode token
  const decoded_token = jwt_decode(localStorage.userToken);

  //Set decoded user
  store.dispatch(setDecodedUser(decoded_token));
}

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <Router>
          <div className="App">
            <Navbar/>
            <Route exact path="/" component={Home}/>
            <Route exact path="/register" component={Register}/>
            <Route exact path="/login" component={Login}/>
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard}/>
            </Switch>
            <Switch>
              <PrivateRoute exact path="/profiledash" component={ProfileDash}/>
            </Switch>
            <Switch>
                <PrivateRoute exact path="/createProfile" component={CreateProfile}/>
            </Switch>
            <Switch>
                <PrivateRoute exact path="/profile/:route" component={Profile}/>
            </Switch>
            <Switch>
                <PrivateRoute exact path="/editprofile" component={EditProfile}/>
            </Switch>
            <Switch>
                <PrivateRoute exact path="/searchhistory" component={SearchHistory}/>
            </Switch>
            <Switch>
                <PrivateRoute exact path="/searchprotein" component={SearchProtein}/>
            </Switch>
            <Switch>
                <PrivateRoute exact path="/showdata" component={ShowData}/>
            </Switch>
          </div>
            <Footer/>
        </Router>
      </Provider>
    );
  }
}

export default App;
