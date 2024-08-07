// import mongoose from "mongoose";
import slugify from "slugify";
import { Badges, calculatePrice, discountType } from "../../src/Utils/index.js";
import mongoose from "../global-setup.js";
const { Schema, model } = mongoose;

const productSchema = new Schema({
    //Strings section 
    title:{
        type: String,
        required: true,
        trim: true, 
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
        default: function (){
            return slugify(this.title , {lower : true , replacement : "-"})
        }
    },
    overView: String,
    specs:Object, 
    badge:{
        type:String,
        enum : Object.values(Badges) ,
    },
    // Numbers section
    price: {
        type: Number, 
        required: true,
        min:10,
    },
    appliedDiscount: {
        discountAmount: {
            type: Number,
            min:0, 
            default:0,
        },
        discountType: {
            type: String, 
            enum: Object.values(discountType),
            default: discountType.PERCENTAGE
        }
    },
    appliedPrice: {
        type: Number,  
        required: true,
        // default: function () {
        //     if (this.appliedDiscount.discountType == discountType.PERCENTAGE) {
        //         return this.price - (this.price * this.appliedDiscount.discountAmount) / 100;
        //     } else if (this.appliedDiscount.discountType == discountType.FIXED) {
        //         return this.price - this.appliedDiscount.discountAmount
        //     }else{
        //         return this.price
        //     }
        // }
        default: function () { return calculatePrice(this.price, this.appliedDiscount.discountAmount, this.appliedDiscount.discountType) }, 
    },
    stock:{
        type: Number, 
        required: true, 
        min: 0
    },
    rating: {
        type:Number, 
        min: 0,
        max: 5, 
        default: 0
    },
    // Images section
    Images: {
        URLs: [
{            secure_url:{
                type: String, 
                required: true,
            },
            public_id: {
                type: String,
                required: true,
                unique: true , 
            },
}
        ],
        customId:{
            type: String,
            required: true,
            unique: true, 
        }
    },
    //ids section 
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subCategoryId: {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true
    },
    brandId: {
        type: Schema.Types.ObjectId,
        ref: "brand",
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",    // TODO: Change to true after adding authentication
        required:false,
    }
} , {timestamps:true})


export const Product = mongoose.models.Product || model("Product" , productSchema)