import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //toggle like on video
  const like  =true
  if(!videoId)
  throw new ApiError(400,"video id is required")
  const likeExist = await  Like.aggregate([
    {$match :{
      video:videoId
    }
  },
  {
    $match : {
      likedBy:new mongoose.Types.ObjectId(req.user._id)
    }
  } 
  ])
  if(likeExist[0])
  { 
    sub = false
    const likedelete  = await  Like.deleteOne({
    video : videoId,
    likedBy : req.user._id
  })
  }
  else
  {
    const likeit = await Like.create({
      video : videoId,
      likedBy :req.user._id
    })
  }
  return res
  .status(200)
  .json(
    new ApiResponse(200,{likeNow :like },"toggled the like"))
  
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //toggle like on comment
  const like  =true
  if(!commentId)
  throw new ApiError(400,"video id is required")
  const likeExist = await  Like.aggregate([
    {$match :{
      comment:commentId
    }
  },
  {
    $match : {
      likedBy:new mongoose.Types.ObjectId(req.user._id)
    }
  } 
  ])
  if(likeExist[0])
  { 
    sub = false
    const likedelete  = await  Like.deleteOne({
    comment : commentId,
    likedBy : req.user._id
  })
  }
  else
  {
    const likeit = await Like.create({
      comment : commentId,
      likedBy :req.user._id
    })
  }
  return res
  .status(200)
  .json(
    new ApiResponse(200,{likeNow :like },"toggled the like"))
  
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //toggle like on tweet
  const like  =true
  if(!tweetId)
  throw new ApiError(400,"video id is required")
  const likeExist = await  Like.aggregate([
    {$match :{
      tweet:tweetId
    }
  },
  {
    $match : {
      likedBy:new mongoose.Types.ObjectId(req.user._id)
    }
  } 
  ])
  if(likeExist[0])
  { 
    sub = false
    const likedelete  = await  Like.deleteOne({
    tweet : tweetId,
    likedBy : req.user._id
  })
  }
  else
  {
    const likeit = await Like.create({
      tweet : tweetId,
      likedBy :req.user._id
    })
  }
  return res
  .status(200)
  .json(
    new ApiResponse(200,{likeNow :like },"toggled the like"))
  
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //get all liked videos
  const likedVideos = await Like.aggregate([
    {
      $match:{
        likedBy : new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup : {
        from:  "videos",
        localField: "video",
        foreignField:  "_id",
        as: "likedVideos"
      }
    },
    {
      $project : {
        likedVideos : 1,
        likedBy:  1
      }
    }
  ])
  return res
  .status(200)
  .json(200,likedVideos,"all liked videos fetched successsfully")
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
