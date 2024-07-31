import { Router } from "express";
import { createSubCategory, deleteSubCategory, getSubCategories, updateSubCategory } from "./sub-categories.controller.js";
import { errorHandler } from "../../Middlewares/error-handling.middleware.js";
import { multerHost } from "../../Middlewares/multer.middleware.js";
import { extensions } from "../../Utils/index.js";
import { getDocumentByName } from "../../Middlewares/finders.middleware.js";
import { subCategory } from "../../../DB/Models/sub-categories.model.js";

const subCategoryRouter = Router();


subCategoryRouter.post("/create", multerHost({allowedExtensions:extensions.Images}).single("image"),getDocumentByName(subCategory),  errorHandler(createSubCategory))


subCategoryRouter.get('/' , errorHandler(getSubCategories))

subCategoryRouter.put('/update/:_id', multerHost({ allowedExtensions: extensions.Images }).single("image"), errorHandler(updateSubCategory))

subCategoryRouter.delete("/delete/:_id", errorHandler(deleteSubCategory))


export { subCategoryRouter };
