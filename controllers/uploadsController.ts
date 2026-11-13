import { Request,Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UploadedFile } from "express-fileupload";
import path from "path"
import * as CustomError from "../errors"
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

export const uploadProductImageLocal=async (req:Request,res:Response)=>{
    // console.log(req.files);
    
    if(!req.files){
        throw new CustomError.BadRequestError ('No File uploaded') 
    }

      let productImage=req.files?.image as UploadedFile
       
   if(!productImage.mimetype.startsWith('image')){
      throw new CustomError.BadRequestError('Please Upload image')   
   }

   const maxSize:number=1000;
   if(productImage.size > maxSize){
    throw new CustomError.BadRequestError('pls upload image smaller than 1Kb')
   }

      const imagePath=path.join(__dirname,'../public/uploads/'+`${productImage.name}`)
       await productImage.mv(imagePath)
      return res.status(StatusCodes.OK).json({image:{src:`/uploads/${productImage.name}`}})
}

 
export const uploadProductImage=async(req:Request,res:Response)=>{
    
    const image=req.files?.image as UploadedFile 
  const result=await cloudinary.uploader.upload(image.tempFilePath,{
      use_filename:true,
      folder:'uploaded-file'

  })
//   console.log(result);
fs.unlinkSync(image.tempFilePath)
return res.status(StatusCodes.OK).json({image:{src:result.secure_url}})
}