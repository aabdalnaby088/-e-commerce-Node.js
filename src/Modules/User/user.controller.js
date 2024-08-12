
import { compare, hashSync } from "bcrypt";
import { User, Address } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/index.js";
import jwt from 'jsonwebtoken'
import { sendEmailService } from '../../Services/sendEmail.service.js';

/**
 * @api {POST} /users/register Register a new user
 */

export const registerUser = async (req,res,next) => {
    const { userName, email, password, gender, age, phone, userType, country, city, postalCode, buildingNumber, floorNumber, addressLabel } = req.body; 

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
    


    const addressInstance = new Address (
    { 
        userId:userObj._id,
        country, 
        city, 
        postalCode, 
        buildingNumber, 
        floorNumber, 
        addressLabel, 
        isDefault:true
    }
    )

    const token = jwt.sign({ userId: userObj._id }, "confirmationLinkToken", { expiresIn: '1h' });
    const confirmationLink = `${req.protocol}://${req.headers.host}/user/verify-email/${token}`;
        const { accepted, rejected, envelope } = await sendEmailService({
            to: email,
            subject: "Welcome to the app - verify your email",
            htmlMessage: `<a href="${confirmationLink}">Please verify your email address</a>`,
        });

        if (rejected.length > 0) {
            return res.status(500).json({ message: "Verification email failed to send" });
        }
    const newUser = await userObj.save(); 
    const newAddress = await addressInstance.save();

    res.status(201).json({
        message : "User created successfully",
        user : newUser,
        address: newAddress
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

export const signIn = async (req,res,next) => {
    const {email , password} = req.body;
    const user = await User.findOne({email:email});
    if(!user){
        return next(new ErrorClass("User not found" , 404))
    }
    const isPasswordMatch = await compare(password, user.password)
    if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email, userName: user.userName }, 'accessToken', { expiresIn: '1h' })

    return res.status(200).json({ message: "User signed in successfully", token });


}


/**
 * @api {GET} Verify E-mail
 */

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params

        const data = jwt.verify(token, "confirmationLinkToken")

        const user = await User.findById(data.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isEmailVerified = true;
        await user.save();
        return res.status(200).json({ message: "Email verified successfully" });
    } catch (err) {
        res.status(500).json({ message: "error in server", message: err })
    }
}