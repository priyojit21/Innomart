import cartSchema from "../../models/cart/cartSchema.js";
import { statusCode } from "../../config/constant.js";
import productSchema from "../../models/product/productSchema.js";

export const addProductToCart = async (req, res) => {
  try {
    const { productId, variationId, userId } = req.body;

    const product = await productSchema.findById(productId);

    if (!product) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }

    const variation = product.variation.id(variationId);

    if (!variation) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Variation not found",
      });
    }

    if (variation.stock < 1) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Stock is empty for the selected variation",
      });
    }

    const existingCartItem = await cartSchema.findOne({
      userId,
      productId,
      variationId,
    });

    if (existingCartItem) {
      if (variation.stock > existingCartItem.quantity) {
        existingCartItem.quantity++;
        existingCartItem.price = variation.sellingPrice;
        await existingCartItem.save();

        return res.status(statusCode.OK).json({
          success: true,
          message: "Product quantity updated in cart",
          cartItem: existingCartItem,
        });
      }

      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Product quantity exhausted",
        cartItem: existingCartItem,
      });
    }

    const newCartItem = await cartSchema.create({
      userId,
      productId,
      variationId,
      price: variation.sellingPrice,
      quantity: 1,
    });

    return res.status(statusCode.CREATED).json({
      success: true,
      message: "Product added to cart",
      cartItem: newCartItem,
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
