const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },

    files:[{
        index:String,
        content:String,
        date:{
            type:Date,
            default:Date.now
        },
    }],

    route:{
        type:String
    },

    status:{
        type:String
    },

    location:{
        type:String
    },

    profession:{
        type:String
    },
    
    social:{
        youtube:{
            type:String
        },
      
        facebook:{
            type:String
        },

        linkedin:{
            type:String
        }
    }
});

module.exports = Profile = mongoose.model('profile',ProfileSchema);