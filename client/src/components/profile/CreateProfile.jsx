import React, { Component } from 'react'
import { createProfile } from '../../actions/profileAction';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

class CreateProfile extends Component {
    constructor(props){
        super(props);
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps)
        if(nextProps.errors){
            this.setState({errors:nextProps.errors})
        }
    }

    state = {
        errors:{},
        location:'',
        route:'',
        profession:'',
        facebook:'',
        linkedin:'',
        youtube:'',
    }

    onChange = (e) =>{
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = (event) =>{
        event.preventDefault();

        if(this.state.route === ''){
            this.state.route = this.props.auth.user.first_name + '.' + this.props.auth.user.last_name; 
        }

        const newProfile = {
          route:this.state.route,
          facebook:this.state.facebook,
          youtube:this.state.youtube,
          linkedin:this.state.linkedin,
          location:this.state.location,
          profession:this.state.profession
        }
        console.log(newProfile);
        this.props.createProfile(newProfile, this.props.history);
    }

  render() {
    const errors = this.state.errors;
    const user = this.props.auth.user;
    let routeHolder = 'Profile route, default is ' + user.first_name +'.'+user.last_name;

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
            <div className="card mt-20 shadow-sm p-3 mb-2 bg-white rounded text-center"><h1 className="display-4">Create Profile</h1> 
            <p className="lead text-center text-muted">
                    Fill your profile
            </p>
            </div>
                <div className="card mt-20 card mt-20 shadow p-3 mb-5 bg-white rounded">
                <small className="d-block pb-3 text-left">* = required fields</small>
                <form onSubmit={this.onSubmit} className="d-block pb-3 text-left">

                    <div className="form-group">
                        <input
                            type="text"
                            className={classnames('form-control form-control-lg', {
                            'is-invalid': errors.route})}
                            placeholder={routeHolder}
                            name="route"
                            value={this.state.route}
                            onChange={this.onChange}
                        />
                        <small className="form-text text-muted">A unique name for your profile URL, It will help members to find you</small>
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
                    <input type="submit" value="Submit" className="btn btn-primary btn-block mt-3"/>
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
    auth:state.auth,
    errors:state.errors
});

export default connect(mapStateToProps,{createProfile})(withRouter(CreateProfile));
