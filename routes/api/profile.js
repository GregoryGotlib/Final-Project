const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const profileValidation = require('../../validation/profile');
const fs = require('fs');
const java = require('java');
var nameCounter=0;
var seqCounter=0;
var idCounter=0;
var jarfile = require("jarfile");

// Post search data by name 
router.post('/name',(req,res)=>{
    nameCounter++
    const fileData = new Uint8Array(Buffer.from(req.body.byName));
    fs.writeFile('byNameDataFile.'+nameCounter+'.txt', fileData, (err) => {
        if (err) throw err;
        console.log('byNameDataFile file has been saved!');
      }); 

// Get the Main-Class entry from foo.jar.
/*jarfile.fetchJarAtPath("../Main.jar", function (err, jar) {
    console.log(jar.valueForManifestEntry("Main-Class"))
    console.log(err) 
})
*/

/*var filename ='44_Seed-AAGTVPVYPAPSNMGSDRFE.pcn';
var valuesToSend = new Array();
fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + filename);
    valuesToSend.push(data.substring(106,108))
    valuesToSend.push(data.substring(109,139))
    console.log(valuesToSend);
  });
*/

var exec = require('child_process').exec;
var child = exec('java -jar ./Main.jar',
function (error, stdout, stderr){
console.log('Output -> ' + stdout);
if(error !== null){
  console.log("Error -> "+error);
}
});
})

// Post search data by sequence 
router.post('/seq',(req,res)=>{
    seqCounter++
    const fileData = new Uint8Array(Buffer.from(req.body.bySeq));
    fs.writeFile('bySeqDataFile'+seqCounter+'.txt', fileData, (err) => {
        if (err) throw err;
        console.log('bySeqDataFile file has been saved!');
      }); 
})

// Post search data by id 
router.post('/id',(req,res)=>{
    idCounter++;
    const fileData = new Uint8Array(Buffer.from(req.body.byID));
    fs.writeFile('byIdDataFile'+idCounter+'.txt', fileData, (err) => {
        if (err) throw err;
        console.log('byIdDataFile file has been saved!');
      }); 
})

// Get profile
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{

    Profile.findOne({user:req.user.id}).populate('user',['first_name','last_name','avatar']).then(profile=>{
        if(!profile)
            return res.status(404).json('Profile not found');
        res.json(profile);
    }).catch(error => res.status(404).json(error));
});


// Post/Update profile
router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    console.log('inside post profile..')
    const {errors,isValid} = profileValidation(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

    const profileData = {};
    profileData.social = {};
    profileData.user = req.user.id;

    // Loading data
    if(req.body.route){
        profileData.route = req.body.route;
    }

    if(req.body.status)
        profileData.status = req.body.status    
    
    if(req.body.youtube){
        profileData.social.youtube = req.body.youtube;
    }

    if(req.body.facebook){
        profileData.social.facebook = req.body.facebook;
    }

    if(req.body.linkedin){
        profileData.social.linkedin = req.body.linkedin;
    }
    

    if(req.body.location){
        profileData.location = req.body.location;
    }

    if(req.body.profession){
        profileData.profession = req.body.profession;
    }

    Profile.findOne({user: req.user.id}).then(profile =>{
        if(profile){
            // In case of existing profile - > updating..
            Profile.findOneAndUpdate({user:req.user.id},{$set: profileData}, {new:true}).then(profile=>{
                res.json(profile)
            });
        }
        else{
            // In case of new profile - > create..
            Profile.findOne({route: profileData.route}).then(profile=>{
                if(profile){
                    return res.status(400).json('That route already exists!');
                }
                new Profile(profileData).save().then(profile=>{
                    res.json(profile)
                });
            }).catch(error=>{
                res.status(404).json(error);
            });
        }
    }).catch(error=>{
        res.status(404).json(error);
    });
});


// Get all profiles
router.get('/all',(req,res)=>{
    Profile.find().populate('user',['first_name','last_name','avatar']).then(profiles=>{
        if(!profiles)
            return res.status(404).json('There are no profiles available ..');
        res.json(profiles);
    }).catch(error=>res.status(404).json(error));
});

// Delete profile
router.delete('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOneAndRemove({user:req.user.id}).then(()=>{
        User.findOneAndRemove({_id:req.user.id}).then(()=>{
            res.json('The profile has been deleted successfully..');
        });
    })
})

// Get profile by route
router.get('/route/:route',(req,res)=>{
    Profile.findOne({route: req.params.route}).populate('user',['name','avatar']).then(profile =>{
        if(!profile){
            return res.status(404).json({msg:'Profile not found!'})
        }
        res.json(profile);
    }).catch(error=>{
        res.status(404).json(error);
    });
});

module.exports = router;