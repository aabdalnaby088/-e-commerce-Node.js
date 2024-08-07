import { hashSync } from "bcrypt";
import mongoose from "../global-setup.js";
const { Schema, model } = mongoose;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true, 
    }, 
    email: {
        type: String, 
        required: true,
        trim: true,
    },
    password: {
        type: String, 
        required: true,
        trim: true
    },
    userType: {
        type: String,
        required: true,
        enum: ["Buyer" , "Admin"]
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String, 
        required: true, 
        enum: ["male" , "female"]
    },
    phone: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isMarkedAsDeleted: {
        type: Boolean,
        default: false
    },
},
{timestamps: true} 
)

userSchema.pre('save', function (next) {
    if(this.isModified("password")){
        this.password = hashSync(this.password, +process.env.SALT_ROUNDS);
    }
    next();
});

export const User = mongoose.models.User || model("User" , userSchema)