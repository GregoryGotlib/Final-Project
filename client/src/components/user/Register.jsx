import React, { Component } from 'react'
import { connect } from 'react-redux'
import { userReg } from '../../actions/authAction'
import { withRouter } from 'react-router-dom';
import classnames from 'classnames'

class Register extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
        if(this.props.auth.isAuthenticated)
            this.props.history.push('/dashboard');
    }

    state = {
        first_name:'',
        last_name:'',
        email:'',
        password:'',
        confirmPassword:'',
        errors:{}
    }


    onChange = (e) =>{
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = (e) =>{
        e.preventDefault();

        const newUser = {
            first_name:this.state.first_name,
            last_name:this.state.last_name,
            password:this.state.password,
            confirmPassword:this.state.confirmPassword,
            email:this.state.email
        }
        console.log(this.state.errors)
        console.log(newUser)
        this.props.userReg(newUser,this.props.history);
    }


  render() {
    const errors = this.props.errors;

    return (
    <div className="container">
        <div className="card mt-20 shadow-sm p-3 mb-2 bg-white rounded text-center"><h1 className="display-4">Registration Form</h1> </div>
        <div className="card mt-20 shadow p-3 mb-5 bg-white rounded">
            <div className="register">
                <div className="container">
                    <div className="row">       
                        <div className="col-md-8 m-auto">
                            <br/>
                            <form noValidate onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <input 
                                    type="text" 
                                    className={classnames('form-control form-control-lg',{
                                    'is-invalid':errors.first_name})}
                                    placeholder="First name" 
                                    name="first_name" 
                                    value={this.state.first_name}
                                    onChange={this.onChange} />
                                    {errors.first_name && (<div className="invalid-feedback">{errors.first_name}</div>)}
                                </div>

                                <div className="form-group">
                                    <input 
                                    type="text" 
                                    className={classnames('form-control form-control-lg',{
                                    'is-invalid':errors.last_name})}
                                    placeholder="Last name" 
                                    name="last_name" 
                                    value={this.state.last_name}
                                    onChange={this.onChange} />
                                    {errors.last_name && (<div className="invalid-feedback">{errors.last_name}</div>)}
                                </div>

                                <div className="form-group">
                                    <input 
                                    type="email" 
                                    className={classnames('form-control form-control-lg',{
                                    'is-invalid':errors.email})}
                                    placeholder="Email address" 
                                    name="email" 
                                    value={this.state.email}
                                    onChange={this.onChange} />
                                    {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                                    <small className="form-text text-muted">This site uses Gravatar, please use Gravatar email for profile image</small>
                                </div>

                                <div className="form-group">
                                    <input 
                                    type="password" 
                                    className={classnames('form-control form-control-lg',{
                                    'is-invalid':errors.password})}
                                    placeholder="Password" 
                                    name="password" 
                                    value={this.state.password}
                                    onChange={this.onChange} />
                                    {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                                </div>

                                <div className="form-group">
                                    <input 
                                    type="password" 
                                    className={classnames('form-control form-control-lg',{
                                    'is-invalid':errors.confirmPassword})}
                                    placeholder="Confirm password" 
                                    name="confirmPassword" 
                                    value={this.state.confirmPassword}
                                    onChange={this.onChange} />
                                    {errors.confirmPassword && (<div className="invalid-feedback">{errors.confirmPassword}</div>)}
                                </div>
                                <input type="submit" className="btn btn-info btn-block mt-4"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
  }
}


const mapStateToProps = (state) =>({
    auth:state.auth,
    errors:state.errors
})

export default connect(mapStateToProps,{userReg})(withRouter(Register));