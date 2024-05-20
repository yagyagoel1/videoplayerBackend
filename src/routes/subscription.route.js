import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {getSubscribedChannels, getSubscribedChannels, toggleSubscription } from "../controllers/subscription.controller.js";
const router = express.Router();

router.use(verifyJWT);

router.route("/c/:channelId")
    .get(getSubscribedChannels)
    .post(toggleSubscription)

router.route("/u/:subscriberId").get(getSubscribedChannels)




export default router;