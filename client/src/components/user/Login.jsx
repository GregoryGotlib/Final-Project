import React, { Component } from 'react'
import classnames from 'classnames';
import { connect } from 'react-redux';
import { userLogin } from '../../actions/authAction';
import { withRouter } from 'react-router-dom';

 class Login extends Component {
  constructor(){
    super();  
  }

  state = {
    email:'',
    password:'',
    errors:{}
  }

  componentDidMount(){
    if(this.props.auth.isAuthenticated){
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.auth.isAuthenticated){
      this.props.history.push('/dashboard');
    }
  }

  onChange = (e) =>{
    this.setState({ [e.target.name]: e.target.value });
}
  
  onSubmit = (e) =>{
    e.preventDefault();
    const User={
      email:this.state.email,
      password:this.state.password
    }
    this.props.userLogin(User);
  }

  render() {
    const errors = this.props.errors;
    
    return (
<div className="container">
<div className="card mt-20 shadow-sm p-3 mb-2 bg-white rounded text-center"><h1 className="display-4">Login</h1> </div>
  <div className="card mt-20 card mt-20 shadow p-3 mb-5 bg-white rounded">
    <div className="login">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <p className="lead text-center">You are about to get started ..</p>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="form-group">
                <input type="email"  className={classnames('form-control form-control-lg',{
                'is-invalid':errors.email})} placeholder="Email Address" name="email" 
                value={this.state.email} onChange={this.onChange} />
                {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
              </div>
              
              <div className="form-group">
                <input type="password" className={classnames('form-control form-control-lg',{
                'is-invalid':errors.password})} placeholder="Password" name="password"  value={this.state.password} onChange={this.onChange}/>
                {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
              </div>
              <input type="submit" className="btn btn-info btn-block mt-4" />
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


const mapStateToProps = (state)=>({
  auth:state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { userLogin })(withRouter(Login));