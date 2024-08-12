

/**
 * @api {POST} /coupons/create
 */

import { Coupon, User } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/index.js";

export const createCoupon = async (req,res,next) => {
    const { till, from, couponType, couponAmount, couponCode, Users } = req.body;

    // coupon code check

    const isCouponExists = await Coupon.findOne({couponCode}) ; 

    if(isCouponExists){
        return next (new ErrorClass("Coupon Already Exists" , 409 , "Coupon Already Exists")) ; 
    }

    // create array with the user IDs

    const userIds = Users.map(u => u.userId) ; 

    // verify that users are already exists 

    const actualUsers = await User.find({_id:{$in : userIds}}) ; 

    if(actualUsers.length !== userIds.length){
        return next (new ErrorClass("Invalid User IDs" , 400 , "Invalid User IDs"))
    }

    const newCoupon = new Coupon({
        till, from, couponType, couponAmount, couponCode, Users
    })

    await newCoupon.save() 
    res.status(201).json({message : "Coupon Created Successfully" , coupon : newCoupon})
}