import { response } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"
const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken= await user.generateAccessToken()
        const refreshToken =  await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {
            accessToken,
            refreshToken
        }
        
    } catch (error) {
        throw new ApiError(500,"something went wrong while generating access and refresh token")
    }
}
const registerUser = asyncHandler(async (req,res)=>{
    //get user details from user
    //validation-not empty
    //check if user already exist4
    //check for images check for avatar
    //upload them to cloudinary,avatar
    //create user object - create entry in db
    //remove passworrd and refresh token feild from response 
    //check for user creation 
    //return res
     const {fullName,email,username,password} = req.body
     if([fullName,email,username,password].some(feild=>
        feild?.trim()===""))
        {
            console.log([fullName,email,username,password].map(x=>x==""))

            throw new ApiError(400,"All feilds are required")
        }
        
       const existedUser = await User.findOne({
            $or : [{username},{email}]

        })
        if(existedUser)
        {
            throw new ApiError(409,"user with emaill or  username already exist")

        }
        const avatarLocalPath =req.files?.avatar[0]?.path
        let coverImagePath;
        if(req.files && Array.isArray(req.files.coverImage)&&req.files.coverImage.length>0)
        coverImagePath = req.files.coverImage[0].path
        if(!avatarLocalPath)
        {
            throw new ApiError(400,"avatar files is required")
        }
        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage= await uploadOnCloudinary(coverImagePath)
        if(!avatar)
        {
            throw new ApiError(400,"avatar not found")

        }
       const user  = await  User.create(
            {
            fullName,
            avatar : avatar.url,
            coverImage : coverImage?.url||"",
            email,
            password,
            username : username.toLowerCase()
            })
        const createdUser =  await User.findById(user._id).select("-password -refreshToken");

        if(!createdUser)
        {
            throw new ApiError(500,"Soomething went wrong while registering the user")

        }
        return res.status(201).json(new ApiResponse(200,createdUser,"user registerd successfully"))
    })

const loginUser = asyncHandler(async (req,res)=>{
    //taking user info 
    //cchekcing whether the login cred is correct
    //creating access token and refresh token
    //saving them into the user local storage
    const {email,username ,password}= req.body;
    if(!(username||email))
    {
        throw new ApiError(400,"username or email is required")
    }
   const user  = await  User.findOne({
        $or : [{username},{email}]
    })
    if(!user)
    {
        throw new ApiError(404,"user doesnt exist")
    }
  const isPasswordValid=   await  user.isPasswordCorrect(password)

  if(!isPasswordValid)
  {
    throw new ApiError(401,"Invalid user Credentials")
  }
  const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
  const loggedUser = await User.findById(user._id).select("-password -refreshToken")
  const options = {
    httpOnly:true,
    secure : true
  }
  return  res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
        200,
        {
            user: loggedUser,
            acccessToken,
            refreshToken
        },
        "user logged in successfully"
    )
  )
})
const logoutUser =asyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken : undefined
        }
    },
    {
        new: true
    })
    const options = {
        httpOnly:true,
        secure :true
    }
    return res.status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200,{},"user logged out"))
})
const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
     const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken
     if(!incomingRefreshToken)
      {
      throw new ApiError(401,"unauthorized request")
      }
      const decodedToken = await jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)   
      const user  = await  User.findById(decodedToken?._id)
      if(!user)
      {
          throw new ApiError(401,"Invalid refresh token ")
      }
      if(incomingRefreshToken!=user.refreshToken)
      {
          throw new ApiError(401,"refresh token is expired or used")
      }
      const options = {
          httpOnly: true,
          secure: true
      }
      const {acccessToken,newRefeshToken } = await generateAccessAndRefreshToken(user._id)
      return res
      .status(200)
      .cookie("accessToken",acccessToken ,options)
      .cookie("refreshToken",newRefeshToken,options)
      .json(
          new ApiResponse(200,
              {acccessToken,refreshToken : newRefeshToken},"access token refreshed")
  
      )
  } catch (error) {
    throw new ApiError(401,error.message||"invalid token ")
  }
})
const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword} = req.body;
  const user =  await  User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
  if(!isPasswordCorrect)
  throw new ApiError(400,"Invalid old password")
    user.password = newPassword
    await user.save({validateBeforeSave:false})
    return res
    .status(200)
    .json(new ApiResponse(200,{},"password changed successfully"))
})
const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(
        new ApiResponse(200,req.user,"current user fetch successfully")
    )
})
export {registerUser
    ,loginUser
    ,logoutUser
    ,refreshAccessToken
    ,changeCurrentPassword
    ,getCurrentUser}