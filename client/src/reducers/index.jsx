import { combineReducers } from 'redux'
import authReducer from './authReducer'
import errorReducer from './errorReducer'
import profileReducer from './profileReducer'
import dashboardReducer from './dashboardReducer'


export default combineReducers ({
    auth: authReducer,
    errors: errorReducer,
    profile: profileReducer,
    dashboard: dashboardReducer
});