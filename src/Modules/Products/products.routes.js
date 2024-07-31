import { Router } from "express";
// controllers
import * as controller from "./products.controller.js";
// middlewares
import * as Middlewares from "../../Middlewares/index.js";
// utils
import { extensions } from "../../Utils/index.js";
//models
import { brand } from "../../../DB/Models/brand.model.js";

const productRouter = Router();

productRouter.post('/add' , Middlewares.multerHost({allowedExtensions: extensions.Images}).array('images' , 5), Middlewares.checkIfIdsExit(brand) , Middlewares.errorHandler(controller.addProduct) )

productRouter.put('/update/:productId' , Middlewares.errorHandler(controller.updateProduct) )

productRouter.get('/list' , Middlewares.errorHandler(controller.getProducts))

productRouter.get('/:id' , Middlewares.errorHandler(controller.getProductById))

productRouter.delete('/delete/:id' , Middlewares.errorHandler(controller.deleteProductById))


export { productRouter };
