import { Router } from "express";
import { registerUser, signIn, updateUser, verifyEmail } from "./user.controller.js";

import * as Middlewares from "../../Middlewares/index.js";

export const userRouter = Router() ; 

userRouter.post('/register' , Middlewares.errorHandler(registerUser)) ; 

userRouter.patch('/update/:id' , Middlewares.errorHandler(updateUser)); 

userRouter.post('/login' , Middlewares.errorHandler(signIn)); 

userRouter.get('/verify-email/:token', Middlewares.errorHandler(verifyEmail)); 
