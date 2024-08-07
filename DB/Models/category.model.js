import mongoose from "mongoose";
const { Schema, model } = mongoose;

// import mongoose from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // TODO: Change to true after adding authentication
    },
    Images: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
        unique: true,
      },
    },
    customId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);


categorySchema.post('findOneAndDelete' , async function (next) {
  const _id = this.getQuery()._id; 
  
  const deletedSubCategory = await mongoose.models.subCategory.deleteMany({
    categoryId: _id
  })

  console.log("deleted SubCategories", deletedSubCategory.deletedCount );
  if(deletedSubCategory.deletedCount){
    
    const deletedBrands = await mongoose.models.brand.deleteMany({
      categoryId: _id
    })

    console.log("deleted brands", deletedBrands.deletedCount);
    if(deletedBrands.deletedCount){
      await mongoose.models.Product.deleteMany({
        categoryId: _id
      })
    }
}
// next()
})

export const Category =
  mongoose.models.Category || model("Category", categorySchema);


// const {Schema , model} = mongoose

// const categorySchema = new Schema({
//   name : {
//     type : String,
//     required : true,
//     trim : true, 
//     unique: true
//   },
//   slug: {
//     type : String, 
//     required : true,
//     unique : true 
//   },
//   createdBy : {
//     type: mongoose.Schema.ObjectId,
//     ref : "User", // TODO: Add user model change required to true 
//     required: false
//   },
//   images : {
//     secure_url : {
//       type : String,
//       required : true
//     },
//     public_id: {
//       type:String,
//       required:true,
//       unique: true 
//     }
//   },
//   customId: {
//     type:String,
//     required: true , 
//     unique: true
//   }
// } , {
//   timestamps: true
// }) 


// export const Category = mongoose.model.Category || model("category" , categorySchema)