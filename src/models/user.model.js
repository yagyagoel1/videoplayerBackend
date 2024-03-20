import mongoose, { Schema } from "mongoose";

const userSchema  = new mongoose.Schema({
    username : {
        type : String,
        requried :true,
        unique : true,
        lowercase : true,
        trim :true,
        index:true
    },
    email :{
        type : String,
        requried :true,
        unique : true,
        lowercase : true,
        trim :true
    },
    fullName : {
        type : String,
        requried :true,
        trim :true,
        index:true
    },
    avatar : {
        type : String,//cloudinary url
        requried :true,
        
    },
    coverImage : {
        type : String,
       
    },
    watchHistory :[
        {
            type : Schema.Types.ObjectId,
            ref : "Video"
    }],
    password : {
        type : String,
        requried : [true ,"password  is requried" ]
        },
        refreshToken :{
            type : String,

        },
      
},
{
    timestamps:true
});



export const   User = new mongoose.model("User",userSchema)


