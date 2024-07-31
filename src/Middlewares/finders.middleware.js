import { ErrorClass } from "../Utils/index.js";

export const getDocumentByName = (model) => {
  return async (req, res, next) => {
    const { name } = req.body;
    if (name) {
      const document = await model.findOne({ name });
      if (document) {
        return next(
          new ErrorClass(
            " this name already exists",
            400,
            " this name already exists"
          )
        );
      }
    }
    next();
  };
};


export const checkIfIdsExit = (model) => {
  return async (req, res, next) => {

    //Ids check

    // const brandInfo = await Brand.findById(brand).populate("categoryId").populate("subCategoryId")
    //Ids from req.query
    const { category, subCategory, brandId } = req.query
    const Document = await model.findOne({
      _id: brandId,
      categoryId: category,
      subCategoryId: subCategory
    }).populate([
      { path: "categoryId", select: "customId" },
      { path: "subCategoryId", select: "customId" }
    ])

    if (!Document) {
      return next(ErrorClass("Brand Not found", 404))
    }
    req.document=Document
    next()

  }
}