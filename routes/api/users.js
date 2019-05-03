const express = require('express');
const router = express.Router();
const grav = require('gravatar');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const regValidation = require('../../validation/register');
const loginValidation = require('../../validation/login');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys')

// Registration
router.post('/register',(req,res)=>{
    console.log("inside reg..")
    const { errors, isValid } = regValidation(req.body);
    if(!isValid){
        console.log(errors);
        return res.status(400).json(errors);
    }

    User.findOne({email:req.body.email}).then(user=>{
        if(user){
            return res.status(400).json({email:'This email already exists!, please try again.'});
        }

        const avatar = grav.url(req.body.email,{
            size:'150',
            rating:'pg',
            default:'mm'
        });

        const newUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            avatar
        });

        bcrypt.genSalt(10,(error,salt)=>{
            bcrypt.hash(newUser.password, salt,(error,hash)=>{
                if(error){
                    throw error;
                }
                newUser.password = hash;
                newUser.save().then(user => res.json(user)).catch(error => console.log(error))
            });
        });
    });
});

// Login
router.post('/login',(req,res)=>{
    const { errors, isValid } = loginValidation(req.body);

    if(!isValid){
        console.log(errors);
        return res.status(400).json(errors);
    }

    User.findOne({email:req.body.email}).then(user=>{
        if(!user){
            return res.status(404).json({email:'User not exists!'});
        }
        console.log("user exists!!!!!")
        const password = req.body.password;
        bcrypt.compare(password, user.password).then(isValid =>{
            if(isValid){
                const data = {id:user.id, first_name:user.first_name,
                last_name:user.last_name, avatar:user.avatar}
                jwt.sign(data,keys.secretOrKey,{expiresIn:7200}, (error, token)=>{
                    res.json({success:true,token:'Bearer ' + token})
                });
            }
            else{
                return res.status(400).json({password:'Password incorrect!'})
            }

        });
    });
});

// Get current user
router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json(req.user);
});

module.exports = router;

//להרים סרבר בספרינג בוט שכתוב בגאווה,
// לבדוק אם אפשר לקרוא קובץ ג'אר עם נוד