export class ApiFeatures{
    constructor(mongooseQuery , filters , query){
        console.log(query);
        
        this.mongooseQuery = mongooseQuery;
        this.filters = filters; 
        this.query = query; 
    }

    sort(){
        const { sortBy, type = 1 } = this.query
        const sort = { [sortBy] : Number(type) }
        
        this.mongooseQuery = this.mongooseQuery.sort(sort) ; 
        return this;
    }

    pagination(){
        const { page = 1, limit = 5} = this.query; 
        const skip = (page - 1) * limit 

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit); 
        return this
    }

    filter(){
        this.mongooseQuery.find(this.filters)
        
        return this
    }

}