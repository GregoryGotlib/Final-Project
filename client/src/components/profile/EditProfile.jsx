import React, { Component } from 'react'
import { createProfile, getProfile } from '../../actions/profileAction';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import checkInput from '../../utilities/checkInput';

class EditProfile extends Component {
    constructor(props){
        super(props);
    }

    state = {
        errors:{},
        location:'',
        route:'',
        profession:'',
        facebook:'',
        linkedin:'',
        youtube:''
    }


    componentDidMount(){  
        this.props.getProfile();
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps)
        if(nextProps.errors){
            this.setState({errors:nextProps.errors})
        }

        // Copies the profile fields to the edit profile path
        if(nextProps.profile.profile){
            console.log(nextProps.profile.profile)
            const profile = nextProps.profile.profile;

            console.log(nextProps.profile.profile)
            if(checkInput(profile.location)){
                profile.location = '';
            }

            if(checkInput(profile.route)){
                profile.route = '';
            }

            if(checkInput(profile.profession)){
                profile.profession = '';
            }

            if(checkInput(profile.social)){
                profile.social = {};
            }
            
            if(checkInput(profile.social.linkedin)){
                profile.social.linkedin = '';
            }

            if(checkInput(profile.social.facebook)){
                profile.social.facebook = '';
            }

            if(checkInput(profile.social.youtube)){
                profile.social.youtube = '';
            }

            this.setState({
            location:profile.location,
            route:profile.route,
            profession:profile.profession,
            facebook:profile.social.facebook,
            linkedin:profile.social.linkedin,
            youtube:profile.social.youtube,
            });
        }
    }


    onChange = (e) =>{
        this.setState({ [e.target.name]: e.target.value });
    }
    
    onSubmit = (event) =>{
        event.preventDefault();
        const newProfile = {
          route:this.state.route,
          facebook:this.state.facebook,
          youtube:this.state.youtube,
          linkedin:this.state.linkedin,
          location:this.state.location,
          profession:this.state.profession
        }
     
        this.props.createProfile(newProfile, this.props.history);
    }

  render() {
    const errors = this.state.errors;
    let socialData=(
    <div>
        <div className="input-group mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text">
                <i className="fab fa-facebook" />
                </span>
            </div>
            <input
                className={classnames('form-control form-control-lg', {
                'is-invalid': errors.facebook
                })}
                placeholder="Facebook Profile URL"
                name="facebook"
                value={this.state.facebook}
                onChange={this.onChange}
            />
            {errors.facebook && <div className="invalid-feedback">{errors.facebook}</div>}
        </div>

        <div className="input-group mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text">
                <i className="fab fa-linkedin" />
                </span>
            </div>
            <input
                className={classnames('form-control form-control-lg', {
                'is-invalid': errors.linkedin
                })}
                placeholder="linkedin Profile URL"
                name="linkedin"
                value={this.state.linkedin}
                onChange={this.onChange}
            />
            {errors.linkedin && <div className="invalid-feedback">{errors.linkedin}</div>}
        </div>

        <div className="input-group mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text">
                <i className="fab fa-youtube" />
                </span>
            </div>
            <input
                className={classnames('form-control form-control-lg', {
                'is-invalid': errors.youtube
                })}
                placeholder="Youtube Profile URL"
                name="youtube"
                value={this.state.youtube}
                onChange={this.onChange}
            />
            {errors.youtube && <div className="invalid-feedback">{errors.youtube}</div>}
        </div>

    </div>
    );

   
return (
<div className="createProfile"> 
    <div className="container">
        <div className="row">
            <div className="col-md-8 m-auto">
            <div className="card mt-20 shadow-sm p-3 mb-2 bg-white rounded text-center"><h1 className="display-4">Edit Profile</h1> </div>
            <div className="card mt-20 card mt-20 shadow p-3 mb-5 bg-white rounded">
                <small className="d-block pb-3">* = required fields</small>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            className={classnames('form-control form-control-lg', {
                            'is-invalid': errors.route})}
                            placeholder="Profile Route"
                            name="route"
                            value={this.state.route}
                            onChange={this.onChange}
                        />
                        <small className="form-text text-muted"> A unique name for your profile URL, It will help members to find you</small>
                        {errors.route && <div className="invalid-feedback">{errors.route}</div>}
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            className={classnames('form-control form-control-lg', {
                            'is-invalid': errors.profession})}
                            placeholder="Your profession"
                            name="profession"
                            value={this.state.profession}
                            onChange={this.onChange}
                        />
                        <small className="form-text text-muted">* What do you do for living?</small>
                        {errors.profession && <div className="invalid-feedback">{errors.profession}</div>}
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            className={classnames('form-control form-control-lg', {
                            'is-invalid': errors.location})}
                            placeholder="Location"
                            name="location"
                            value={this.state.location}
                            onChange={this.onChange}
                        />
                        <small className="form-text text-muted">* Where do you live?</small>
                        {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                    </div>
                    <div className="mb-3">
                        {socialData}
                    <input type="submit" value="Edit" className="btn btn-info btn-block mt-3"/>
                    <a href="/profiledash" className="btn btn-danger btn-block mt-3 mb-2">Go Back</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</div>
    )
  }
}

const mapStateToProps = (state) => ({
    profile:state.profile,
    errors:state.errors
});

export default connect(mapStateToProps,{createProfile ,getProfile})(withRouter(EditProfile));
