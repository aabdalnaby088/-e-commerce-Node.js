import { Router } from "express";
import { multerHost } from "../../Middlewares/multer.middleware.js";
import { extensions } from "../../Utils/index.js";
import { errorHandler } from "../../Middlewares/error-handling.middleware.js";
import { createCategory, deleteCategory, getCategory, updateCategory } from "./categories.controller.js";
import { getDocumentByName } from "../../Middlewares/finders.middleware.js";
import { Category } from "../../../DB/Models/category.model.js";
// // controllers
// import * as controller from "./categories.controller.js";
// // utils
// import { extensions } from "../../Utils/index.js";
// // middlewares
// import * as middlewares from "../../Middlewares/index.js";
// // models
// import { Category } from "../../../DB/Models/index.js";


// // get the required middlewares
// const { errorHandler, getDocumentByName, multerHost } = middlewares;

// const categoryRouter = Router();

// // routes
// categoryRouter.post(
//   "/create",
//   multerHost({ allowedExtensions: extensions.Images }).single("image"),
//   getDocumentByName(Category),
//   errorHandler(controller.createCategory)
// );

// categoryRouter.get("/", errorHandler(controller.getCategory));

// categoryRouter.put(
//   "/update/:_id",
//   multerHost({ allowedExtensions: extensions.Images }).single("image"),
//   getDocumentByName(Category), 
//   errorHandler(controller.updateCategory)
// );

// export { categoryRouter };


const categoryRouter = Router()

categoryRouter.post('/create' ,multerHost({allowedExtensions:extensions.Images}).single("image"), getDocumentByName(Category) , errorHandler(createCategory) )

categoryRouter.get("/" , errorHandler(getCategory))

categoryRouter.put("/update/:_id" ,
  multerHost({allowedExtensions:extensions.Images}).single("image"),
  getDocumentByName(Category),
  errorHandler(updateCategory)
)

categoryRouter.delete("/delete/:_id" , errorHandler(deleteCategory))

export {
  categoryRouter
} 

