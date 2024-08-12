
import  jwt  from 'jsonwebtoken';
import { User } from '../../DB/Models/user.model.js';
import { ErrorClass } from '../Utils/error-class.utils.js';


const auth  =  () =>{
    return async (req,res,next) => {
        const {token} = req.headers; 
        if (!token)
            return res.status(400).json({error: 'Token not provided'});
        if(!token.startsWith("memoHi")){
            next(new ErrorClass('Invalid token' , 400 , 'auth layer'))
        }
        const originalToken = token.split(' ')[1]; 
        const decodedData = jwt.verify(originalToken , "accessToken"); 
        if (!decodedData?.userId){
            return res.status(400).json({error: 'Invalid token'});
        }
        const user = await User.findById(decodedData.userId)
        if (!user){
            return res.status(400).json({error: 'please signup or login first'});
        }
        req.user = user;
    
        next(); 
    }
}

export {
    auth
}