import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  // create playlist
  if(!name||!description)
  throw new ApiError(400,"name and description are required")
  const createPlaylist =  await Playlist.create({
    name,
    description,
    owner :req.user._id
  })
  const playlist = await Playlist.findById(createPlaylist._id).select("-_id")
 if(!playlist)
 throw new ApiError(500,"there was some problem while creating the playlist")
  return res
  .status(200)
  .json(new ApiResponse(200,playlist,"playlist has been created successfully"))
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  // get user playlists
  if(!userId)
  throw new ApiError(400,"user id is required")
  const playlists = await Playlist.find({
    owner :userId
  }).select("-_id")
  return res
  .status(200)
  .json(200,playlists,"playlist fetched successfully")
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // get playlist by id
  if(!playlistId)
  throw new ApiError(400,"playlist id is required")
  const playlist = await Playlist.findById(playlistId)
  if(!playlist)
  throw new ApiError(400,"playlist not found")
  return res
  .status(200)
  .json(new ApiResponse(200,playlist,"playlist fetched succcessfully"))
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if(!playlistId||!videoId)
  throw new ApiError(400,"videoid and playlist id are required")
  const newPlaylist = await Playlist.updateOne({
    _id : playlistId
  },{
    $push:{videos:videoId}  },{ new: true })
  res
  .status(200)
  .json(new ApiResponse(200,newPlaylist,"added a video in the playlist"))
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  //  remove video from playlist
  if(!playlistId&&!videoId)
  throw new ApiError()
  const newPlaylist = await Playlist.updateOne({_id :playlistId},{
    $pull :{videos:videoId}
  },{new :true})
  return res
  .status(200)
  .json(new ApiResponse(200,newPlaylist,"playlist was updated successfully"))
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // delete playlist
  if(!playlistId)
  throw new ApiError(400,"playlist id is required ")
  const deletedPlaylist =  await Playlist.deleteOne({
    _id : req.user._id
  })
  if(!deletePlaylist)
  throw new ApiError(400,"no playlist was foound with the id")
  return res
  .status(200)
  .json(200,{},"playlist deleted successfully")
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //update playlist
  if(!playlistId||!(name||description))
  {
    throw new ApiError(400,"playlist id name and description are required ")
  }
  const udpatedPlaylist = await Playlist.updateOne({_id : playlistId},
   {
    $set : {
      description : description,
      name : name
    }
   },{new:true})
   return res
   .status(200)
   .json(200,udpatedPlaylist,"the playlist has been updated successfully")
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
