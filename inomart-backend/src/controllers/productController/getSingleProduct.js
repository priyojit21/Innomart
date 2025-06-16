import { statusCode } from "../../config/constant.js";
import Products from "../../models/product/productSchema.js";

export const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;

    const product = await Products.findOne({ _id: productId }, { sellerId: 0 });

    if (!product) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Product Doesn't Exist.",
      });
    }

    const findRelatedProduct = [];

    // Finding by subcat
    if (product.subCategory) {
      findRelatedProduct.push(
        await Products.find({
          subCategory: product.subCategory,
          _id: { $ne: productId },
        })
          .skip(skip)
          .limit(limit)
      );
    }

    const relatedProductIds = findRelatedProduct
      .flat()
      .map((product) => product._id);

    findRelatedProduct.push(
      await Products.find({
        category: product.category,
        _id: { $ne: productId, $nin: relatedProductIds },
      })
        .skip(skip)
        .limit(limit)
    );

    if (findRelatedProduct.length === 0) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "No Related Products Found",
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      message: "Product Retrieved.",
      data: product,
      relatedProducts: findRelatedProduct.flat(),
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
