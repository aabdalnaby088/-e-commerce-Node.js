import { calcSubTotal } from "../../src/Modules/Cart/Utils/cart.utils.js";
import mongoose from "../global-setup.js";

const {Schema , model} = mongoose

const cartSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }, 
    products:[
        {
            productId:{
                type:Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },
            quantity:{
                type:Number,
                required:true,
                default:1
            },
            price : {
                type:Number,
                required:true
            }
        }
    ],
    subTotal:Number
}, {timestamps:true})

cartSchema.pre('save' , function(next){
    this.subTotal = calcSubTotal(this.products) ; 
    next() ; 
})

cartSchema.post('save' , async function (doc) {
    if (this.products.length === 0) {
        await Cart.deleteOne({ userId : doc.userId })
    }
})

export const Cart = mongoose.models.Cart || model("Cart" , cartSchema) ; 