import { discountType } from "./enums.utils.js";


export const calculatePrice = (price , amount , type) => {
    if (type == discountType.PERCENTAGE) {
       return  price - (price * amount) / 100;
    } else if (type == discountType.FIXED) {
        return  price - amount
    } else {
        return price
    }
}