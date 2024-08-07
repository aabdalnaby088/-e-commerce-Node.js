
import { Category } from "../../../DB/Models/category.model.js";

import slugify from "slugify"
import { ErrorClass } from "../../Utils/error-class.utils.js"
import { cloudinaryConfig, uploadFile } from "../../Utils/cloudinary.utils.js";
import { nanoid } from "nanoid";
import { subCategory } from "../../../DB/Models/sub-categories.model.js"
import { brand } from "../../../DB/Models/brand.model.js";
import { ApiFeatures } from "../../Utils/api-features.utils.js";



/**
 * @api {POST} /category/create
 */

export const createCategory = async (req,res,next) => {
  const {name} = req.body
  //generate slug 
  const slug= slugify(name , {
    replacement: "_",
    lower:true 
  }) 
  //image 
  if(!req.file){
    return next(new ErrorClass("please upload an image" , 400 , "Please upload image"))
  }

  //upload the image to cloudinary
  const customId = nanoid(4)
  const { secure_url, public_id } = await uploadFile({
    file: req.file.path,
    folder: `${process.env.UPLOADS_FOLDER}/Categories/${customId}`,
  });


  console.log(public_id );
  


    const category = {
      name,
      slug,
      Images: {
        secure_url,
        public_id
      },
      customId,
    };
//create the category in the db 
const newCategory = await Category.create(category)

res.status(201).json({
  status: "success",
  message: "Category created successfully",
  data: newCategory
})
} 

/**
 * @api {GET} /categories get categories by name, id or slug
 */


export const getCategory = async (req,res,next) => {
  const {id , name , slug} = req.query; 
  let queryFilter = {} ; 
  if(id) queryFilter.id = id 
  if(name) queryFilter.name = name
  if(slug) queryFilter.slug = slug

  const category = await Category.findOne(queryFilter)
  if(!category){
    return next(new ErrorClass("category not found",404,"category not found"))
  }
  res.status(200).json({status : "success", 
    message: "category found successfully",
    data:category
  })
}

/**
 * @api {PUT} /categories/update/:_id update category 
 */

export const updateCategory = async (req,res,next) => {
  const {_id} = req.params;
  const category = await Category.findById(_id)
  if(!category){
    return next(new ErrorClass("category not found" , 404 , "category not found"))
  }
  const {name } = req.body
  if (name){ 
    const slug = slugify(name , {
      replacement: "-",
      lower:true,
    })
    category.name = name ; 
    category.slug = slug
  }

  if(req.file){
        const splittedPublicId = category.Images.public_id.split(
          `${category.customId}/`
    )[1];
    const {secure_url} = await cloudinaryConfig().uploader.upload(req.file.path , {
      folder: `${process.env.UPLOADS_FOLDER}/Categories/${category.customId}`,
      publicId: splittedPublicId
    })
    category.Images.secure_url = secure_url;
  }


  await category.save()
    res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      data: category,
    });
}


/**
 * @api {DELETE} /categories/delete/:_id delete category 
 */

export const deleteCategory = async (req,res,next) => {
  const {_id} = req.params;
  const category = await Category.findByIdAndDelete(_id); 
  if(!category){
    return next(new ErrorClass("category not found" , 404 , "category not found"))
  }

  const categoryPath = `${process.env.UPLOADS_FOLDER}/Categories/${category.customId}`

await cloudinaryConfig().api.delete_resources_by_prefix(categoryPath )
await cloudinaryConfig().api.delete_folder(categoryPath)



res.status(200).json({
  status: "success",
  message: "Category deleted successfully",
  data: category
})

}

/**
 * @api {GET} /categories/list list categories 
 */

export const listCategories = async (req,res,next) => {
  const { name, slug } = req.query; 
  const mongooseQuery = Category.find() ; 
  let queryFilter = {};
  if (name) queryFilter.name = name
  if (slug) queryFilter.slug = slug
  const apiFeatures = new ApiFeatures(mongooseQuery, queryFilter ,req.query).pagination().sort().filter()

  const list = await apiFeatures.mongooseQuery; 
  res.status(200).json({
    message: 'success', 
    data: list
  })
}