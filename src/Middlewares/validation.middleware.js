const reqKeys = ["body", "query", "params", "headers"];
import { ErrorClass } from '../Utils/index.js';

export const validationMiddleware = (schema)=>{
    return (req , res , next)=>{
        let validationErrors = [] ; 
        for (const key of reqKeys){
            const validationResult = schema[key]?.validate(req[key] , {abortEarly : false})
            console.log({ validationResult });
            if(validationResult?.error){
                validationErrors.push(validationResult.error.details)
            }
            if (validationErrors.length>0){
                return next(new ErrorClass(validationResult.error, 400, "validation layer", key))
            }
        }
        next();
    }
}