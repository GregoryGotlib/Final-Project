import React, { Component } from 'react'
import { connect } from 'react-redux'
import { userLogout } from '../../actions/authAction'

class Navbar extends Component {

    logoutHandler = (e)=>{
        e.preventDefault();
        this.props.userLogout();
    }

  render() {
    const isAuthenticated = this.props.auth.isAuthenticated;
    const user = this.props.auth.user;

    const guestNav = (
        <ul className="navbar-nav ml-auto mr-5">
            <li className="nav-item">
                <a href="/register" className="nav-link">Register</a>
            </li>
            <li className="nav-item">
                <a href="/login" className="nav-link">Login</a>
            </li>
        </ul>
    )

    const authenticatedUserNav = (
        <ul className="navbar-nav ml-auto mr-5">
            <li className="nav-item">
            <a href="#" className="nav-link" onClick={this.logoutHandler}><img style={{width:'30px', marginRight:'5px'}} src={user.avatar} alt={user.name} className="rounded-circle"/> Logout
            </a>                
            </li>
        </ul>
    )

    return (
        <nav className="navbar navbar-expand-sm navbar-light bg-light mb-4">
            <a href="/" className="navbar-brand ml-4" >Proteinush</a>
            <button 
            className="navbar-toggler" 
            type="button" 
            data-toggle="collapse" 
            data-target="#collapseData">
            <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="collapseData">
                <ul className="navbar-nav mr-auto mr-5">
                    <li className="nav-item">
                        <a href="/about" className="nav-link">About</a>
                    </li>
                </ul>
                {isAuthenticated ? authenticatedUserNav : guestNav}
            </div>
        </nav>
    )
  }
}

const mapStateToProps = (state) => ({
    auth:state.auth
})

export default connect(mapStateToProps,{userLogout})(Navbar);