import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";
import { checkOwner } from './../middlewares/owner.middleware.js';
import { Tweet } from "../models/tweet.model.js";
const router = express.Router();


router.use(verifyJWT);


router.route("/")
    .post(createTweet)

router.route("/:userId")
    .get(getUserTweets)

router.route("/:tweetId")
    .all(checkOwner('tweetId', Tweet))  // check owner if user is owner or not 
    .patch(updateTweet)
      .delete(deleteTweet)

export default router;