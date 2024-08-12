import { Router } from "express";
import * as middleware from '../../Middlewares/index.js'
import { addToCart, getUserCart, removeFromCart, updateCart } from "./cart.controller.js";

export const cartRouter = Router() ; 

cartRouter.post("/add/:productId" , middleware.auth() , middleware.errorHandler(addToCart)) ; 
cartRouter.put("/remove/:productId" , middleware.auth() , middleware.errorHandler(removeFromCart)) ; 
cartRouter.put("/update/:productId" , middleware.auth() , middleware.errorHandler(updateCart)) ;
cartRouter.get("/list" , middleware.auth() , middleware.errorHandler(getUserCart)) ;