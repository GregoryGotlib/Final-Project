import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getProfile, deleteAccount } from '../../actions/profileAction';
import { userLogout } from '../../actions/authAction';
import Spinner from '../base/Spinner';
import ProfileHeader from './ProfileHeader';

class ProfileDash extends Component {
    componentDidMount(){
        this.props.getProfile();
    }

    onDeleteHandler = (e) =>{
      this.props.deleteAccount();
      this.props.userLogout();
    }
   

  render() {
    const loading = this.props.profile.loading
    const profile = this.props.profile.profile
    const user = this.props.auth.user;
    let showData;

    if(profile === null || loading){
      showData = <Spinner/>
    }
    else{
      // If user have a profile
      if(Object.keys(profile).length > 0){
        showData = (
        <div>
          <p className="lead text-muted">
          Welcome {user.first_name} {user.last_name}
          <div >
           <a className="btn btn-info text-center mt-5 mr-3 shadow-lg p-3 rounded" href='/editprofile'>
           Edit profile
           </a>

           <a className="btn btn-success text-center mt-5 mr-3 shadow-lg p-3 rounded" href='/searchhistory'>
           Search history
           </a>

           <a className="btn btn-primary text-center mt-5 mr-3 shadow-lg p-3 rounded" href='/dashboard'>
           Back to dashboard
           </a>

            <button className="btn btn-danger text-center mt-5 shadow-lg p-3 rounded" onClick={this.onDeleteHandler}>Delete Account
            </button>
         </div>
          </p>
          <div>
            <ProfileHeader profile={profile}/>
          </div>
        </div>
        )
      }
      else{
        showData = (
          <div>
            <p className="lead text-muted">Welcome {user.first_name} {user.last_name} !</p>
            <p style={{color:'red'}}>You dont have a profile yet, please create one</p>
            <a href="/CreateProfile" className="btn btn-lg btn-info shadow-sm p-3 rounded">Create profile</a>
            <a href="/dashboard" className="btn btn-lg btn-danger ml-3 shadow-sm p-3 rounded">Back to dashboard</a>
          </div>
        )
      }
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
            <div className="card mt-20 shadow p-3 mb-2 bg-white rounded text-center"><h1 className="display-4">Profile Dashboard</h1> 
            {showData}
            </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>({
  profile:state.profile,
  auth:state.auth
});

export default connect(mapStateToProps,{ getProfile, deleteAccount,userLogout })(ProfileDash);
