import cartSchema from "../../models/cart/cartSchema.js";
import { statusCode } from "../../config/constant.js";
import categorySchema from "../../models/product/categorySchema.js";
// import productSchema from "../../models/product/productSchema.js";

// Get all cart items for a user
export const getCartItems = async (req, res) => {
  try {
    const { userId } = req.body;

    const cartItems = await cartSchema
      .find({ userId })
      .populate("productId", { productImages: 1, productName: 1, category: 1 });

    const categories = await categorySchema.find();
    const categoriesMap = {};
    for (const category of categories) {
      categoriesMap[category._id.toString()] = category.name;
    }
    const updatedCartItems = cartItems.map((item) => ({
      _id: item?._id,
      userId: item?.userId,
      variationId: item?.variationId,
      price: item?.price,
      quantity: item?.quantity,
      productName: item.productId?.productName,
      productId: item.productId?._id,
      productImages: item.productId?.productImages,
      category: item.productId?.category.map(
        (categoryId) => categoriesMap[categoryId]
      ),
    }));

    return res.status(statusCode.OK).json({
      success: true,
      updatedCartItems,
    });
  } catch (error) {
    console.log("error",error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
