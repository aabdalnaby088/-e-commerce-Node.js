import { Product } from "../../../../DB/Models/index.js"


export const checkProductStock = async (productId , Quantity) => {
    return await Product.findOne({ _id: productId, stock: { $gte: Quantity }})
}   


export const calcSubTotal =  (products) => {
    let subTotal = 0

    products.forEach(p => {
        subTotal += p.price * p.quantity
    })

    return subTotal; 
}