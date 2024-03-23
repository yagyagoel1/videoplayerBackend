import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";


dotenv.config({
    path : '../env'
})
connectDB()
.then(()=>{
    try{
    app.on("error",()=>{
      
        throw error;
    })
    app.listen(process.env.PORT||8000,()=>{
        console.log(`server is running at port: ${process.env.PORT}`)
    })
}catch(err){
    console.error("something went wrong while connecting express " +err)
}})
.catch((err)=>{
    console.log("database connection failed"+err)
})
















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
