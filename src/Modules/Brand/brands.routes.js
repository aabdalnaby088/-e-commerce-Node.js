import { Router } from "express";
import { multerHost } from "../../Middlewares/multer.middleware.js";
import { extensions } from "../../Utils/index.js";
import { errorHandler } from "../../Middlewares/error-handling.middleware.js";
import { getDocumentByName } from "../../Middlewares/finders.middleware.js";
import { brand } from '../../../DB/Models/index.js';
import { createBrand, deleteBrand, getBrand, updateBrand } from "./brands.controller.js";
const brandRouter = Router();

brandRouter.post("/create" , multerHost({allowedExtensions:extensions.Images}).single("image") , getDocumentByName(brand) , errorHandler(createBrand))


brandRouter.get('/' , errorHandler(getBrand))


brandRouter.put("/update/:_id" , multerHost({allowedExtensions:extensions.Images}).single("image") , errorHandler(updateBrand))

brandRouter.delete("/delete/:_id" , errorHandler(deleteBrand))
export { brandRouter };
