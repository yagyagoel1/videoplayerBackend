import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  // get all videos based  
  if(!query||!sortBy||!sortType||!userId)
  throw new ApiError(400,"query sort by sort typw user id are required")
  const skipLimit = (page-1)*10;
  const gettingVideos  = await Video.aggregate([
    {
      $match:{
        $and: [
          {"title"  : {$regex :`/${query}/`,options: 'i'}},
          {owner : new mongoose.Types.ObjectId(userId) }

        ]
      }
    },
    {
      $sort : {sortBy : sortType==="asc"? 1 : -1},

    },
    {
      $skip : skipLimit
    },
    {
      limit: parseInt(limit)
    }
  ]) 
  return res
  .status(200)
  .json(new ApiResponse(200,gettingVideos,"videos fetched successfully"))
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // get video, upload to cloudinary, create video
  if(!title||!description)
  throw new ApiError(400,"title and description are required")
  const videoPath = req.files?.path[0];
  const thumbnailPath = req.files?.path[1];
  if(!videoPath||!thumbnailPath)
  throw new ApiError(400,"video and thumbnail path not found")
  const video  = await uploadOnCloudinary(videoPath)
  const thumbnail = await uploadOnCloudinary(thumbnailPath)

  if(!video.url||!thumbnail.url)
  throw new ApiError(500,"there was some problem while uploading the video or thumbnail")
  const videoPublish = await Video.create({
    title,
    description,
    thumbnail: thumbnail.url,
    videoFile : video.url,
    duration : video.eager[0].video_info.duration,
    owner : req.user._id
  })
  const getPublishedVideo = await Video.findById(videoPublish._id)
  return res
  .status(200)
  .json(new ApiResponse(200,getPublishedVideo,"video creaded successfully"))
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // get video by id
  if(!videoId)
  throw new ApiError(400,"video id is required")
  const video  = await Video.findById( videoId)
  if(!video)
  throw new ApiError(400,"video not found")
  if(video.isPublished&&video.owner!=req.user._id)
  throw new ApiError(400 ,"video is private")
  else
  {
    return res 
    .status(200)
    .json(new ApiResponse(200,video,"video fetched successfully"))
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //update video details like title, description, thumbnail
  if(!videoId)
  throw new ApiError(400,"video id is requried")

});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // delete video
  if(!videoId)
  throw new ApiError(400,"video id is required")
  await Video.deleteOne({
    _id: videoId
  })
  return res
  .status(200)
  .json(200,{},"video has been deleted")

});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if(!videoId)
  throw new ApiError(400,"video id is required")
  const getVideo = await Video.findById(videoId)
  getVideo.isPublished= getVideo.isPublished===true ?false :true;
  getVideo.save({validateBeforeSave:false});
  return res
  .status(200)
  .json(new ApiResponse(200,{},"toggled the publlish state successfully"))
  
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
