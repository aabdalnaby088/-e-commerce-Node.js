
import { Cart, Product } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/index.js";
import { checkProductStock } from "./Utils/cart.utils.js";



/**
 * @api {POST} /carts/add Add to cart 
*/

export const addToCart = async (req,res,next) => {
    const userId = req.user._id
    const {quantity} = req.body ;
    const {productId} = req.params; 

    // Check the availability of product 

    const product = await checkProductStock(productId , quantity)

    if (!product){
        return next(ErrorClass("Product Not available" , 404 , "Check quantity"))
    }

    const cart = await Cart.findOne({userId}) ; 

    if(!cart){
        const subTotal = product.appliedPrice * quantity ; 
        const newCart = new Cart({
            userId,
            products:[
                { productId : product._id, quantity, price: product.appliedPrice }
            ], 
            subTotal
        })

        await newCart.save(); 
        return res.json({message : "Product added to cart successfully" , newCart})
    }

    const isProductExists = cart.products.find(p=> p.productId == productId)
    if(isProductExists){
        return next(new ErrorClass("Product Already Exists in Cart", 400, "Product Already Exists in Cart"))
    }
    // Adding new product to the cart 
    cart.products.push({ productId: product._id, quantity, price: product.appliedPrice }) ; 

    await cart.save()
    return res.json({message : "Product added to cart successfully" , cart})

}

/**
 * @api {PUT} /carts/remove remove item from cart
*/

export const removeFromCart = async (req,res,next) => {
    const userId = req.user._id
    const {productId} = req.params ;
    const cart = await Cart.findOne({userId , 'products.productId':productId}) ;
    if(!cart){
        return next(new ErrorClass("Product Not found in cart", 404, "Product Not found in cart"))
    } 
    let subTotal = 0 ; 
    cart.products = cart.products.filter(p => p.productId != productId) ; 


    cart.products.forEach(p => {
        subTotal += p.price*p.quantity
    });
    
    cart.subTotal = subTotal

    await cart.save() ; 

    return res.status(200).json({message : "Product removed from cart successfully" , cart})

}

/**
 * @api {PUT} /carts/Update Update items quantity from cart
*/

export const updateCart = async (req,res,next) => {
    const userId = req.user._id
    const {quantity} = req.body ;
    const {productId} = req.params ;
    const cart = await Cart.findOne({userId , 'products.productId':productId}) ;

    if(!cart){
        return next(new ErrorClass("Product Not found in cart", 404, "Product Not found in cart"))
    }
    
    const product = await checkProductStock(productId , quantity) ; 
    if(!product){
        return next(new ErrorClass("Product Not available in stock", 404, "Product Not available in stock"))
    }

    const productIdx = cart.products.findIndex(p => p.productId == product._id.toString())
    
    cart.products[productIdx].quantity = quantity

    await cart.save() ;
    return res.status(200).json({message : "Quantity updated successfully" , cart})
}

/**
 * @api {GET} /carts/list get all items from cart
*/

export const getUserCart = async (req,res,next) => {
    const userId = req.user._id
    const cart = await Cart.findOne({userId}) ;
    if(!cart){
        return next(new ErrorClass("Cart Not found", 404, "Cart Not found"))
    }
    return res.status(200).json({message : "Cart items fetched successfully" , cart})
}