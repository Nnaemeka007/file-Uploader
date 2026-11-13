import "dotenv/config"
import express,{Express,Request,Response} from "express"
import mongoose from "mongoose"
import { notFound as notFoudMiddlware } from "./middleware/not-found"
import { errorHandler as errorHandlerMiddleware } from "./middleware/error-handler"
import { router as productRouter } from "./routes/productRoutes"
import fileUpload from "express-fileupload"
import {v2 as cloudinary} from "cloudinary"


const app:Express=express()


if(!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET){
     throw new Error('name,key or secret is not seen in env ')
    }
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

app.use(express.static('./public'))
app.use(express.json())
app.use(fileUpload({useTempFiles:true}))



app.get('/',(req:Request,res:Response)=>{
    res.send('<h1>File Upload Starter</h1>')
})

// routes
app.use('/api/v1/products',productRouter)

// errorHandler Middleware
app.use(notFoudMiddlware)
app.use(errorHandlerMiddleware)

// connectDB
const port=process.env.PORT
const start=async()=>{
    if(!process.env.DATABASE_URL){
        throw new Error('cannot read db_URL from env')
    }
 try {
    await mongoose.connect(process.env.DATABASE_URL)
    app.listen(port,()=>{
    console.log(`Server is hosted on ${port}...`)
})
 } catch (error) {
    console.log(error)
 }
}
start()