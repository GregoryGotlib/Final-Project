const Validator = require('validator');
const checkInput = require('./checkInput');

module.exports = function profileValidation(input){
    let errors = {};

    if(checkInput(input.location))    
        input.location = '';

    if(checkInput(input.profession))    
        input.profession = '';
    
    if(Validator.isEmpty(input.profession,{min: 4})){
        errors.profession = 'Your profession is required!';
    }

    if(Validator.isEmpty(input.location,{min: 4})){
        errors.location = 'Your location is required!';
    }

    if(!checkInput(input.youtube)){
        if(!Validator.isURL(input.youtube)){
            errors.youtube = 'Invalid URL!';
        }
    }

    if(!checkInput(input.linkedin)){
        if(!Validator.isURL(input.linkedin)){
            errors.linkedin = 'Invalid URL!';
        }
    }   

    if(!checkInput(input.facebook)){
        if(!Validator.isURL(input.facebook)){
            errors.facebook = 'Invalid URL!';
        }
    }
        return {
        errors,
        isValid:checkInput(errors)
    }
};