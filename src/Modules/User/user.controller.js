
import { hashSync } from "bcrypt";
import { User } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/index.js";


/**
 * @api {POST} /users/register Register a new user
 */

export const registerUser = async (req,res,next) => {
    const {userName , email , password , gender , age , phone , userType} = req.body; 

    // check if email already exists 

    const isEmailExist = await User.findOne({email}); 
    if(isEmailExist){
        return next(new ErrorClass("Email already exists" , 409)) ; 
    }

    const userObj = new User(
        {
            userName,
            email,
            password,
            gender,
            age,
            phone,
            userType
        }
    ) 

    const newUser = await userObj.save(); 

    res.status(201).json({
        message : "User created successfully",
        user : newUser
    })

}

/**
 * @api {UPDATE} /users/register Register a new user
 */

export const updateUser = async (req,res,next) => {
    const {id} = req.params;
    const {userName , email , password , gender , age , phone , userType} = req.body
    const user = await User.findById(id);
    if(!user){
        return next(new ErrorClass("User not found" , 404))
    }
    if(userName){
        user.userName = userName;
    }if(email){
        user.email = email;
    }if(gender){
        user.gender = gender;
    }if(age){
        user.age = age;
    }if(phone){
        user.phone = phone;
    }if(userType){
        user.userType = userType;
    }if(password){
        const hashedPassword = hashSync(password, Number(process.env.SALT_ROUNDS) );
        user.password = hashedPassword;
    }
    await user.save();
    res.status(200).json({
        message:"User Updated Successfully", 
        user:user
    })
}