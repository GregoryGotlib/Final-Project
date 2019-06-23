import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getProfilebyRoute } from '../../actions/profileAction';
import ProfileHeader from './ProfileHeader';
import Spinner from '../base/Spinner';

 class Profile extends Component {


  componentDidMount(){
    if(this.props.match.params.route){
      this.props.getProfilebyRoute(this.props.match.params.route);
    }
  }
  
  render() {
    const profile = this.props.profile.profile;
    const loading = this.props.profile.loading;
    let profileData;
    if(profile === null || loading){
      profileData = <Spinner/>
    }
    else{
      profileData = (
        <div>
          <div className="row">
            <div className="col-md-6">
            <div className="card mt-20 shadow p-3 mb-2 bg-white rounded text-center">
            </div>
            </div>
            <div className="col-md-6"/>
          </div>
          <ProfileHeader profile={profile}/>
        </div>
      )
    }
    return (
    <div className="profile">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {profileData}
          </div>
        </div>
      </div>
    </div>  
    )
  }
}


const mapStateToProps = (state) => ({
  profile:state.profile,
});

export default connect(mapStateToProps, {getProfilebyRoute} )(Profile);