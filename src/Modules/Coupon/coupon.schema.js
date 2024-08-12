import Joi from "joi";

export const CreateCouponSchema = {
    body: Joi.object({
        couponCode: Joi.string().required(),
        from: Joi.date().greater(new Date().getDate()).required(),
        till: Joi.date().greater(Joi.ref('from')).required(),
        Users: Joi.array().items(Joi.object({
            userId: Joi.string().required(),
            maxCount: Joi.number().required().min(1),
        })).required(),
        couponType: Joi.string().valid("Percentage" , "Fixed").required(),
        couponAmount: Joi.number().when('couponType', {
            is: Joi.string().valid("Percentage"),
            then: Joi.number().max(100),
        }).min(1).required()
    }),
};