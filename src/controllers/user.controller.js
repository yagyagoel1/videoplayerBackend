import { upload } from "../middlewares/multer.middleware.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
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
        
       const existedUser =  User.findOne({
            $or : [{username},{email}]

        })
        if(existedUser)
        {
            throw new ApiError(409,"user with emaill or  username already exist")

        }
        const avatarLocalPath =req.files?.avatar[0]?.path
        const coverImagePath = req.files?.coverImage[1]?.path
        if(!avatarLocalPath)
        {
            throw new ApiError(400,"avatar files is required")
        }
        console.log(req.files)
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
        const createdUser =  await user.findById(user._id).select("-password -refreshToken");

        if(!createdUser)
        {
            throw new ApiError(500,"Soomething went wrong while registering the user")

        }
        return res.status(201).json(new ApiResponse(200,createdUser,"user registerd successfully"))
    })

export {registerUser}