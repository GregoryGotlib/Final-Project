const Validator = require('validator');
const checkInput = require('./checkInput');
module.exports = function loginValidation(data){
    let errors = {};

    // Initializing data   
    if(checkInput(data.password))
        data.password = '';

    if(checkInput(data.email))
        data.email = '';
        
    // Data validation

    if(!Validator.isEmail(data.email))
        errors.email = 'Email is invalid ..'

    if(Validator.isEmpty(data.email))
        errors.email = 'Email is required ..'

    if(Validator.isEmpty(data.password))
        errors.password = 'Password is required ..';

    return {
        errors,
        isValid: checkInput(errors)
    }
};