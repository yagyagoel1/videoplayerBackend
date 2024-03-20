import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({

    videoFile :{
        type : String,
        required : true,

    },thumbnail : {
        type : String,
        required : true,

    },
    title : {
        type : String,
        required : true,

    },
    description : {
        type : String,
        required : true,

    },
    duration :{
        
            type : Number,
            required : true,
    },
    views  : {
        type : number,
        default : 0,

    },
    isPublished : {
        type : boolean,
        required : false,

    },
    owner :{
        type : Schema.Types.ObjectId,
        ref : "User"
    }

});

export const Video = new mongoose.model("Video",videoSchema)