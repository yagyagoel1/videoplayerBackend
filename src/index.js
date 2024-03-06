import dotenv from "dotenv"
import connectDB from "./db/index.js";


dotenv.config({
    path : '../env'
})
connectDB()
















/*
import  express  from "express";
const app = express();
;(async ()=>{
    try {
        mongoose.connect(`${process.env.MONGODB_URL}/
        ${DB_NAME}`)
        app.on("errror",(error)=>{
            console.log("Error: ", error)
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`process is  listening  on port ${process.env.PORT}`)
        })
    }
    catch(error)
    {
        console.error("error",error)
        throw err
    }
})()

*/
