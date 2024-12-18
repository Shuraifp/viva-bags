import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
  name : {
      type:String,
      required:true,
      trim:true,
  },
  description : {
      type:String,
      required:true,
  },
  category : {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Category",
      required:true
  },
  brand : {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Brand",
      required:true
  },
  regularPrice : {
      type:Number,
      required:true
  },
  discountedPrice : {
      type:Number,
  },
  stock: { 
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  color: 
    {
      name: {
        type : String,
        required : true
      },
      hex: {
        type : String,
        required : true
      }
    }
  ,
  size: {
    type: String,
    required: true,
  },
  images: [
    {
      filename: String,   
      url: String,           
    }
  ],
  popularity: {
      type:Number,
      default:0
  },
  featured : {
    type: Boolean,
    default:false
  },
  islisted : {
      type:Boolean,   
      default: true,
  },


},{timestamps:true})



const Product = mongoose.model("Product",productSchema)

export default Product;