import { nanoid } from 'nanoid';
//Utils
import { calculatePrice, cloudinaryConfig, discountType, ErrorClass, uploadFile } from "../../Utils/index.js";
//Models
import { Product } from "../../../DB/Models/index.js";
import slugify from 'slugify';

/**
 * @api {POST} /products/add Add Product
 */

export const addProduct = async (req,res,next) => {
    //destructing the request body
    const { title, overView, specs, price, discountAmount, discountType, stock } = req.body; 
    
    if(!req.files.length){
        return next(new ErrorClass("No image uploaded" , 400 , ))
    }
    
    //Ids check

    const brandDocument = req.document ; 


// Images 
const customId = nanoid(4)
const brandCustomId = brandDocument.customId 
const categoryCustomId = brandDocument.categoryId.customId 
const subCategoryCustomId = brandDocument.subCategoryId.customId 
const folder = `${process.env.UPLOADS_FOLDER}/Categories/${categoryCustomId}/Subcategories/${subCategoryCustomId}/Brands/${brandCustomId}/Products/${customId}`
const URLs = [] ; 
for (const file of req.files) {
    //Upload each file to cloudinary
    const {secure_url , public_id} = await uploadFile({
        file: file.path , 
        folder,
    })
URLs.push({secure_url , public_id})
}

const productObject = {
    title,
    overView,
    specs : JSON.parse(specs),
    price,
    appliedDiscount:{
        discountAmount,
        discountType,
    },
    stock,
    Images:{
        URLs,
        customId
    },
    categoryId: brandDocument.categoryId,
    subCategoryId: brandDocument.subCategoryId,
    brandId: brandDocument._id,
};

const newProduct = await Product.create(productObject); 

res.status(201).json({
    status: "success",
    data: newProduct,
})


}   

/**
 * @api {PUT} /products/Update update Product
 */

export const updateProduct = async (req,res,next) => {
    const {productId} = req.params ; 
    //destruction the request body
    const { title, stock, overView, badge, price, discountAmount, TypeOfDiscount, specs } = req.body
    //find product from db
    const productToUpdate =  await Product.findById(productId)
    if(!productToUpdate){
        return next(new ErrorClass("Product not found" , 404))
    }
if(title){
    productToUpdate.title = title
    productToUpdate.slug = slugify(title , {lower:true , replacement: "-"})
}
if(stock) productToUpdate.stock = stock

if(overView) productToUpdate.overView = overView

if(badge) productToUpdate.badge = badge
// price 
if(price || discountAmount || TypeOfDiscount){
    const newPrice = price || productToUpdate.price
    const discount = {} ; 
    discount.discountAmount = discountAmount || productToUpdate.appliedDiscount.discountAmount
    discount.discountType = TypeOfDiscount || productToUpdate.appliedDiscount.discountType
    productToUpdate.appliedPrice = calculatePrice(newPrice, discount.discountAmount,discount.discountType ); 
    productToUpdate.price = newPrice
    if(discount.discountAmount){
        productToUpdate.appliedDiscount.discountAmount = discount.discountAmount
    }
    if (discount.discountType){
        productToUpdate.appliedDiscount.discountType = discount.discountType
    }
}

// specs 

if(specs) productToUpdate.specs = specs

await productToUpdate.save(); 

res.status(201).json({
    status: "success",
    data: productToUpdate,
})

}

/**
 * @api {GET} /products/list get Products pagination - filters 
 */


export const getProducts = async (req,res,next) => {
// find all products 
const {page = 1 , limit = 5 , sortBy , type = 1} = req.query ; 
const { title, minPrice, maxPrice, inStock } = req.body 
const filters = {}; 
const sort = {} ; 
    if (sortBy) {
        sort[sortBy] = Number(type); 
    }
if(title){
    filters.title = { $regex: title, $options: 'i' }
}
if(minPrice){
    filters.appliedPrice = { $gte : minPrice }
}
if(maxPrice){
    filters.appliedPrice = { $lte : maxPrice }
}
if(inStock){
    filters.stock = {$gte : 1}
}
const skip = (page-1)*limit
    const products = await Product.find(filters).limit(limit).skip(skip).populate("categoryId").populate("brandId").sort(sort); 
res.status(200).json({
    status: "success",
    data: products,
})
}

/**
 * @api {GET} /products/:id get Product by id 
 */

export const getProductById = async (req,res,next) => {
    const id = req.params.id ;
    const product = await Product.findById(id)
    if(!product) {
        return next(ErrorClass("No product found with this id" , 404))
    }
    res.status(200).json({
        status: "success",
        data: product,
    })
}

/**
 * @api {DELETE} /products/:id delete Product by id 
 */

export const deleteProductById = async (req,res,next) => {
    const {id} = req.params
    const productToBeDeleted = await Product.findById(id) ; 
    if(!productToBeDeleted) {
        return next(ErrorClass("No product found with this id" , 404))
    }

    const path = productToBeDeleted.Images.URLs[0].public_id.split(productToBeDeleted.Images.customId)[0] + productToBeDeleted.Images.customId
    await cloudinaryConfig().api.delete_resources_by_prefix(path)
    await cloudinaryConfig().api.delete_folder(path)
    res.status(200).json({
        status: "success",
        message: "Product deleted successfully",
        productToBeDeleted
    })
}