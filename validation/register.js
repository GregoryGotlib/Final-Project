const Validator = require('validator');
const checkInput = require('./checkInput');

module.exports = function regValidation(data){
    let errors = {};
    console.log(data);
    // Initializing data
    if(checkInput(data.first_name))
        data.first_name = '';
    
    if(checkInput(data.last_name))
        data.last_name = '';

    if(checkInput(data.password))
        data.password = '';

    if(checkInput(data.confirmPassword))
        data.confirmPassword = '';
    
    if(checkInput(data.email))
        data.email = '';
        
    // Data validation
    

    if(!Validator.isLength(data.first_name,{min: 2, max:20}))
    {
        errors.first_name = 'First name must contain at least 2 characters and maximum 20 characters!';
    }   

    if(Validator.isEmpty(data.first_name))
    {
        errors.first_name = 'First name is required ..';
    }

    if(!Validator.isLength(data.last_name,{min: 2, max:20}))
    {
        errors.last_name = 'Last name must contain at least 2 characters and maximum 20 characters!';
    }

    if(Validator.isEmpty(data.last_name))
     {
        errors.last_name = 'Last name is required ..'
     }   

    if(Validator.isEmpty(data.email))
     {
        errors.email = 'Email is required ..'
     }   

    if(!Validator.isEmail(data.email))
    {
        errors.email = 'Email is invalid ..'
    }
        

    if(Validator.isEmpty(data.password))
    {
        errors.password = 'Password is required ..';
    }   

    if(Validator.isEmpty(data.confirmPassword))
    {
        errors.confirmPassword = 'Please confirm your password ..';
    }   

    if(!Validator.isLength(data.password,{min: 6, max:20}))
    {
        errors.password = 'Password must contain at least 6 characters!';
    }   
    
    if(!Validator.equals(data.password,data.confirmPassword))
    {
        errors.confirmPassword = 'Password not match ..';
    }   

    return {
        errors,
        isValid: checkInput(errors)
    }
};