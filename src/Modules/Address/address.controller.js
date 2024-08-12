


import axios from "axios";
import { Address } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/error-class.utils.js";
/**
 * @api {POST} /addresses Add new address
 */

export const addAddress = async (req,res,next) => {
    const { country, city, postalCode, buildingNumber, floorNumber, addressLabel , setAsDefault} = req.body; 
    
    const userId = req.user._id;
    //  cities validation 
    const cities = await axios.get(`https://api.api-ninjas.com/v1/city?country=EG&limit=30` , {
        headers:{
            'X-Api-Key': process.env.API_KEY_API_CITY
        }
    })
    console.log(cities.data);
    
    const isCityExist = cities.data.find(c=>c.name == city)
    if(!isCityExist){
        return next(new ErrorClass('city not found',400))
    }
    const newAddress = new Address({
        userId,
        country,
        city, 
        postalCode, 
        buildingNumber, 
        floorNumber, 
        addressLabel, 
        isDefault: [true, false].includes(setAsDefault) ? setAsDefault : false 
    })

    // if the new address is default, we need to update the old default address to be not default  
    if (newAddress.isDefault){
        await Address.updateOne({userId, isDefault:true} , {isDefault:false})
    }


    const address = await newAddress.save();
    res.status(201).json({
        message: "Address added successfully",
        address
    })

}

/**
 * @api {POST} /addresses Update address
 */

export const updateAddress = async (req,res,next) => {
    const { country, city, postalCode, buildingNumber, floorNumber, addressLabel, setAsDefault } = req.body; 
    const {addressId} = req.params; 
    const userId = req.user._id;
    const address = await Address.findOne({ _id: addressId, userId , isMarkedAsDeleted : false }) ; 

    if(!address){
        return next(ErrorClass("Address Not found" , 404)) 
    }

if(country) address.country = country; 
if(city) address.city = city;
if(postalCode) address.postalCode = postalCode;
if(buildingNumber) address.buildingNumber = buildingNumber;
if(floorNumber) address.floorNumber = floorNumber;
if(addressLabel) address.addressLabel = addressLabel;
if(setAsDefault) {
    address.isDefault = [true , false].includes(setAsDefault) ? setAsDefault : false;
    // if the new address is default, we need to update the old default address to be not
    if(address.isDefault){
        await Address.updateOne({ userId, isDefault: true }, { isDefault: false })
    }
}
await address.save()
res.status(201).json({
    message: "Address updated successfully",
    address
})}

/**
 * @api {DELETE} /addresses delete address
 */

export const deleteAddress = async (req,res,next) => {
    const { addressId } = req.params;
    const userId = req.user._id;
    const address = await Address.findOneAndUpdate({ _id: addressId, userId, isMarkedAsDeleted: false }, { isMarkedAsDeleted: true , isDefault:false }, {new : true });

    if (!address) {
        return next(ErrorClass("Address Not found", 404))
    }

await address.save()
res.status(200).json({
    message: "Address deleted successfully",
    address
})
}

/**
 * @api {GET} /addresses get address
 */
export const getAllAddresses = async (req,res,next) => {
    const userId = req.user._id;
    const addresses = await Address.find({ userId, isMarkedAsDeleted: false })
    if (!addresses){
        return next(ErrorClass("No addresses found", 404))
    }
    res.status(200).json({
        message: "Addresses retrieved successfully",
        addresses  
    })
}