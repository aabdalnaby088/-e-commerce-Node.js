import { Router } from "express";

import * as middlewares from '../../Middlewares/index.js'
import { CreateCouponSchema } from "./coupon.schema.js";
import { createCoupon } from "./coupon.controller.js";

export const couponRouter = Router() ; 

couponRouter.post("/create" , middlewares.auth() , middlewares.validationMiddleware(CreateCouponSchema), middlewares.errorHandler(createCoupon))