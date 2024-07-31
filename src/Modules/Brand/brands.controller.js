
/**
 * @api {POST} /brands/create crete new brand
 */

import slugify from "slugify";
import { Category } from "../../../DB/Models/category.model.js"
import { subCategory } from "../../../DB/Models/sub-categories.model.js"
import { ErrorClass } from "../../Utils/error-class.utils.js"
import { cloudinaryConfig } from "../../Utils/cloudinary.utils.js";
import { nanoid } from "nanoid";
import { brand } from "../../../DB/Models/brand.model.js";

/**
 * @api /brands/create create brand
 */

export const createBrand = async (req,res,next) => {
    const {categoryId , subCategoryId} = req.query
    const isSubcategory = await subCategory.findOne({
    _id: subCategoryId,
    categoryId
    }).populate("categoryId")
if (!isSubcategory){
    return next(new ErrorClass("cannot find subcategory", 404, "cannot find subcategory"))
}

const {name} = req.body
const slug = slugify(name , {
    replacement: "-",
    lower:true
})

if(!req.file){
    return next(new ErrorClass("please attach file" , 404 , "no file found please attach"))
}
const customId = nanoid(4)
const {secure_url , public_id} = await cloudinaryConfig().uploader.upload(req.file.path , {
    folder: `${process.env.UPLOADS_FOLDER}/Categories/${isSubcategory.categoryId.customId}/SubCategories/${isSubcategory.customId}/Brands/${customId}`
})

const brandObj = {
    name,
    slug,
    logo:{
        secure_url,
        public_id
    },
    customId,
    categoryId: isSubcategory.categoryId._id,
    subCategoryId: isSubcategory._id,

}

const newBrand = await brand.create(brandObj)

res.status(201).json({
    status: "success",
    data: newBrand
})
}


/**
 * @api /brands get brand
 */

export const getBrand = async (req,res,next) => {
    const {id , name , slug} = req.query
    const queryFilter = {}
    if(id) queryFilter._id = id
    if(name) queryFilter.name = name
    if(slug) queryFilter.slug = slug
    const brands = await brand.find(queryFilter)
    if(!brands){
        return next(new ErrorClass("cannot find brand", 404, "cannot find brand"))
    }
    res.status(200).json({
        status: "success",
        data: brands
    })
}

/**
 * @api {PUT} /brands/update/:_id update brand
 */

export const updateBrand = async (req,res,next) => {
    const {_id} = req.params
    const {name} = req.body
    const brandToUpdate = await brand.findById(_id).populate("subCategoryId").populate("categoryId")
// console.log(brandToUpdate.subCategory);
    if(!brandToUpdate){
        return next(new ErrorClass("cannot find brand", 404, "cannot find brand"))
    }

    if(name){
        const slug = slugify(name , {
            lower: true,
            replacement: '-'
        })
    brandToUpdate.name = name
    brandToUpdate.slug = slug;
    }

    if (req.file) {
        const splittedPublicId = brandToUpdate.logo.public_id.split(`${brandToUpdate.customId}`)[1]
        const { secure_url } = await cloudinaryConfig().uploader.upload(req.file.path,
            {
                folder: `${process.env.UPLOADS_FOLDER}/Categories/${brandToUpdate.categoryId.customId}/SubCategories/${brandToUpdate.customId}/Brands/${brandToUpdate.customId}`,
                publicId: splittedPublicId
            }
        )
        brandToUpdate.logo.secure_url = secure_url

    }
    await brandToUpdate.save();

    res.status(201).json({
        status: "success",
        data: brandToUpdate
    })



}

/**
 * @api {DELETE} /brands/delete/:_id update brand
 */

export const deleteBrand = async (req,res,next) => {
    const {_id} = req.params
    const brandToDelete = await brand.findByIdAndDelete(_id).populate("subCategoryId").populate("categoryId")

    if(!brandToDelete){
        return next(new ErrorClass("cannot find brand", 404, "cannot find brand"))
    }

    const brandPath = `${process.env.UPLOADS_FOLDER}/Categories/${brandToDelete.categoryId.customId}/SubCategories/${brandToDelete.subCategoryId.customId}/Brands/${brandToDelete.customId}`

    await cloudinaryConfig().api.delete_resources_by_prefix(brandPath)
    await cloudinaryConfig().api.delete_folder(brandPath)


    res.status(200).json({
        status: "success",
        data: brandToDelete
    })


}