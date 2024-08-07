import { Router } from "express";
import { registerUser, updateUser } from "./user.controller.js";

import * as Middlewares from "../../Middlewares/index.js";

export const userRouter = Router() ; 

userRouter.post('/register' , Middlewares.errorHandler(registerUser)) ; 

userRouter.patch('/update/:id' , Middlewares.errorHandler(updateUser)); 