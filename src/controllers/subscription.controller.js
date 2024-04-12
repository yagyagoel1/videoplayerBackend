import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const sub  =true
  // toggle subscription
  if(!channnelId)
  throw new ApiError(400,"channel  id is required")
  const subExist = await  Subscription.aggregate([
    {$match :{
      channel :channelId
    }
  },
  {
    $match : {
      subscriber:new mongoose.Types.ObjectId(req.user._id)
    }
  } 
  ])
  if(subExist[0])
  { 
    sub = false
    const subdelete  = await  Subscription.deleteOne({
    channel : channelId,
    subscriber : req.user._id
  })
  }
  else
  {
    const createSub = await Subscription.create({
      channel : channelId,
      subscriber :req.user._id
    })
  }
  return res
  .status(200)
  .json(
    new ApiResponse(200,{subscriptionNow :sub },"toggled the subscription"))
  
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if(!channelId)
  {
    throw new ApiError(400,"channel id is required")

  }
  const subscriptions = Subscription.aggregate([
    {
      $match : {
        channel : channelId
      }
    },
    {
      $lookup :{
        from : "users",
        localField : "channel",
        foreignField : "_id",
        as : "ownerDetails"
      }
    },
    {
      $lookup :{
        from : "users",
        localField: "subscriber",
        foreignField : "_id",
        as : "subscribers"
      },
      $project :{
        username: 1,
        fullName : 1,
        avatar : 1
      }
    },
    {
      $addFields :{
        owner : ownerDetails[0]
      }
    },
  ])
  return res
  .status(200)
  .json(new ApiResponse(200,subscriptions,"subs fetched successfully"))
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if(!subscriberId)
  throw new ApiError(400,"subscriber id is required")
  const channelList  =  Subscription.aggregate([
    {
      $match : {
        subscriber : subscriberId
      },
      

    },
    {
      $lookup : {
        from : "users",
        localField : "channel",
        foreignField : "_id",
        as : "subscribedTo"
      },
      $project : {
        fullName : 1,
        username: 1,
        avatar: 1
      }
    },
  ])
  return res 
  .status(200)
  .json(200,channelList,"channell list fetched successfully")
});


export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
