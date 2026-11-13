import mongoose,{model} from "mongoose";

const ProductSchema=new mongoose.Schema({
    name:{
     type:String,
     required:true
    },
    price:{
     type:Number,
     required:true
    },
    image:{
     type:String,
     required:true
    }
})

export const Product=model('Product',ProductSchema)