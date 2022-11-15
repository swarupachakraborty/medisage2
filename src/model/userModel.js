const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({ 

    name: {
        type:String, 
        required:true,
        trim: true
    },
    
    phone_no: {
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },

    email_id: {
        type:String, 
        required:true, 
        unique: true,
        trim: true,
        lowercase: true
    }, 
    password: {
        type: String, 
        required:true,
        trim: true, 
       
    },
    profileImage: {
        type: String,
        required: true
        // s3 link
    },
    
    


  }, { timestamps: true } )

  module.exports = mongoose.model("user", userSchema)