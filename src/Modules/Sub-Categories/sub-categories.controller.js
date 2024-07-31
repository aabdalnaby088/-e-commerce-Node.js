

/**
 * @api {POST} /sub-categories/create create sub-category
 */

import slugify from "slugify";
import { Category } from "../../../DB/Models/category.model.js"
import {  subCategory } from "../../../DB/Models/sub-categories.model.js"
import { ErrorClass } from "../../Utils/error-class.utils.js"
import { cloudinaryConfig } from "../../Utils/cloudinary.utils.js";
import { nanoid } from "nanoid";
import { brand } from "../../../DB/Models/brand.model.js";

/**
 * @api {POST} /sub-categories/create create sub-category
 */

export const createSubCategory = async (req,res,next) => {
    const category = await Category.findById(req.query.categoryId);
    if(!category){
        return next(ErrorClass("category not found" , 404 , "category not found"))
    }
const {name} = req.body
const slug = slugify(name , {
    replacement: "-", 
    lower:true
})

if(!req.file){ 
    return next(new ErrorClass("please upload image",400 , "Please upload an image"))
}

const customId = nanoid(4) ; 
const {secure_url , public_id} = await cloudinaryConfig().uploader.upload(req.file.path , {
    folder: `${process.env.UPLOADS_FOLDER}/Categories/${category.customId}/SubCategories/${customId}`,
});

const subCategoryObj = {
    name,
    slug,
    Images:{
        secure_url,
        public_id
    },
    customId,
    categoryId:category._id
}

const newSubCategory = await subCategory.create(subCategoryObj)

res.status(201).json({
    status: "success",
    message: "Subcategory create successfully",
    data: newSubCategory
})

}

/**
 * @api {GET} /sub-categories Get sub-category
 */

export const getSubCategories = async (req,res,next) => {
    const {id,name,slug} = req.query 
    const queryFilter = {};
    if(id) queryFilter.id = id;
    if(name) queryFilter.name = name;
    if(slug) queryFilter.slug = slug;

    const SubCategory = await subCategory.findOne(queryFilter); 
    if (!SubCategory) return next(new ErrorClass("subcategory not found", 404, "subcategory not found"))
    res.status(200).json({
        status: "success",
        data: SubCategory
    })
}


/**
 * @api {PUT} /sub-categories/update/:_id update sub-category
 */

export const updateSubCategory = async (req,res,next) => {
    const {_id} = req.params; 
    const {name} = req.body
    const Subcategory = await subCategory.findById(_id).populate("categoryId")
    if(!Subcategory){
        return next(new ErrorClass("subcategory not found", 404, "subcategory not found")); 
    }
    if(name){
        const slug = slugify(name , {
            replacement: "-",
            lower:true
        })
        Subcategory.name = name ; 
        Subcategory.slug = slug ;
    }

if(req.file){
    const splittedPublicId = Subcategory.Images.public_id.split(`${Subcategory.customId}`)[1] 
    const { secure_url } = await cloudinaryConfig().uploader.upload(req.file.path , 
    {
    folder :`${process.env.UPLOADS_FOLDER}/Categories/${Subcategory.categoryId.customId}/SubCategories/${Subcategory.customId}`,
    publicId: splittedPublicId
    }
    )
    Subcategory.Images.secure_url = secure_url
}
await Subcategory.save(); 

res.status(201).json({
    status: "success",
    data: Subcategory
})

}

/**
 * @api {DELETE} /sub-categories/delete/:_id delete sub-category
 */

export const deleteSubCategory = async (req,res,next) => {
    const {_id} = req.params;
    const Subcategory = await subCategory.findByIdAndDelete(_id).populate("categoryId");

    if(!Subcategory){
        return next(new ErrorClass("subcategory not found", 404, "subcategory not found"));
    }

    const subCategoryPath = `${process.env.UPLOADS_FOLDER}/Categories/${Subcategory.categoryId.customId}/SubCategories/${Subcategory.customId}`
    await cloudinaryConfig().api.delete_resources_by_prefix(subCategoryPath); 
    await cloudinaryConfig().api.delete_folder(subCategoryPath)

    await brand.deleteMany({ subCategoryId : _id})


    res.status(200).json({
        status: "success",
        data: Subcategory
    })
} 