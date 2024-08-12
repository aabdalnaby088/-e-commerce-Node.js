import mongoose from "mongoose";


const {Schema , model} = mongoose

const couponSchema = new Schema({
    couponCode:{
        type:String,
        required:true,
        unique:true
    },
    couponAmount:{
        type:Number,
        required:true
    },
    couponType:{
        type:String,
        required:true,
        enum:Object.values(['Percentage' , "Fixed"])
    },
    from :{
        type:Date,
        required:true
    },
    till:{
        type:Date,
        required:true
    },
    Users:[
        {
            userId:{
                type:Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            maxCount:{
                type:Number,
                min:1,
                required:true
            },
            usageCount:{
                type:Number,
                default:0
            }
        }
    ],
    isEnabled:{
        type:Boolean,
        default:true
    }
}, {timestamps:true}); 


export const Coupon = mongoose.models.Coupon || model("Coupon" , couponSchema) ; 