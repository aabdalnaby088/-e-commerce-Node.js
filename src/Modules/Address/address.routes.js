import { Router } from "express";

import * as middleware from '../../Middlewares/index.js'
import { addAddress, deleteAddress, getAllAddresses, updateAddress } from "./address.controller.js";

export const addressRouter = Router() ; 

addressRouter.post("/add" , middleware.auth() , middleware.errorHandler(addAddress))

addressRouter.put("/update/:addressId" , middleware.auth() , middleware.errorHandler(updateAddress))

addressRouter.put("/soft-delete/:addressId" , middleware.auth() , middleware.errorHandler(deleteAddress))

addressRouter.get("/get-all-addresses" , middleware.auth() , middleware.errorHandler(getAllAddresses)); 