import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  // get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  if(!videoId)
  throw new ApiError(400,"video id is requried ")
  const skiplimit = (page-1)*limit
  const comments = await Comment.find({video:videoId}).skip(skiplimit).limit(limit).select("-_id")
  return res
  .status(200)
  .json(new ApiResponse(200,comments,`comments fetched successfully from ${skiplimit} to ${limit*page}`))
});


const addComment = asyncHandler(async (req, res) => {
  //  add a comment to a video
  const {content,videoId} =req.body;
  if(!content&&!videoId)
  {
    throw new ApiError(400,"video id and content are required")
  }
  const createdComment = await Comment.create({
    content,
    video : videoId,
    owner : req.user._id
  })
  const getComment  = await Comment.findById(createdComment._id)
  return res
  .status(200)
  .json(new ApiResponse(200,getComment,"comment added successfully"))
});

const updateComment = asyncHandler(async (req, res) => {
  // update a comment
  const {commentId,newContent} = req.body;
  if(!commentId&&!newContent)
  throw new ApiError(400,"comment id and content are required")
  const updatedComment  = await Comment.updateOne({_id: commentId},{
    $set : {
      content :newContent
    }
  })
  return res
  .status(200)
  .json(new ApiResponse(200,updateComment,"comment updated successfully"))
});

const deleteComment = asyncHandler(async (req, res) => {
  // delete a comment
  const {commentId} = req.body;
  if(!commentId)
  throw new ApiError(400,"comment id is required")
  await Comment.deleteOne({_id : commentId})
   return res
   .status(200)
   .json(new ApiResponse(200,{},"comment deleted successfully ")) 
  
});

export { getVideoComments, addComment, updateComment, deleteComment };
