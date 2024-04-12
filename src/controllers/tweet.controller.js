import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  // create tweet
  const {content} = req.body;
  if(!content)
  throw new ApiError(400,"content is required")
  const tweet = await Tweet.create({
    owner :req.user._id,
    content :content
  })
  if(!tweet)
  throw new ApiError(500,"there was some issue while creating the tweet")
});

const getUserTweets = asyncHandler(async (req, res) => {
  //  get user tweets
  const {userId} =req.body;
  if(!userId)
  throw new ApiError(400,"user id is required") 
  const tweets = await Tweet.findById(userId).select("-_id -owner")
  return res
  .status(200)
  .json(new ApiResponse(200,tweets,"tweets fetched successfully"))
});

const updateTweet = asyncHandler(async (req, res) => {
  // update tweet
  const {content,tweetId} =req.body;
  if(!content||!tweetId)
  throw new ApiError(400,"content and tweet id are required")
  const updatedContent = await Tweet.updateById({
  _id : tweetId},{
    $set: {content}
  })
  if(!updateTweet)
  throw new ApiError(500,"there was some issue while updating tthe tweet")
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const {tweetId} = req.body;
  if(!tweetId)
  throw new ApiError(400,"tweet id is required")
  const deleted = await Tweet.deleteOne({
    _id : tweetId
  })
  if(!deleted.n)
  {
    throw new ApiError(400,"there was no tweet associated to that id")

  }
  return res
  .status(200)
  .json(200,{},"tweet deleted successfully")
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
