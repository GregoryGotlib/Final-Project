import React from 'react'
import { Route , Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

 const privateRoute = ({component: Component, auth, ...rest}) => (
     <Route {...rest} render = {props=> auth.isAuthenticated === true ?
         (<Component {...props}/>) : (<Redirect to="/"/>)
    }
    />
 );

privateRoute.propTypes = {
    auth: propTypes.object.isRequired
};

const mapStateToProps = (state) =>({
auth:state.auth
});

export default connect (mapStateToProps)(privateRoute);
