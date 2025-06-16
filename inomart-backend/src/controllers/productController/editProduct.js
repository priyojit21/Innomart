import { statusCode } from "../../config/constant.js";
import mongoose from "mongoose";
import productSchema from "../../models/product/productSchema.js";
import { sendNotification } from "../notificationController/sendNotification.js";

export const editProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      productName,
      sellerId,
      brandName,
      description,
      category,
      tags,
      variations = [],
    } = req.body;

    const existingProduct = await productSchema.findOne({
      _id: productId,
      sellerId,
    });

    if (!existingProduct)
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Product not found.",
      });

    const duplicateProduct = await productSchema.findOne({
      _id: { $ne: productId },
      productName,
      sellerId,
      category,
      description,
      brandName,
      tags,
    });

    if (duplicateProduct)
      return res.status(statusCode.CONFLICT).json({
        success: false,
        message: "This Product Already Exists.",
      });

    const areAllDifferentVariation =
      new Set(variations).size === variations.length;

    if (!areAllDifferentVariation)
      return res.status(statusCode.CONFLICT).send({
        success: false,
        message: "Please add distinct variation.",
      });

    const skuIds = variations.map(variation => JSON.parse(variation).skuId);
    const uniqueSkuIds = new Set(skuIds);

    if (uniqueSkuIds.size !== skuIds.length) {
      return res.status(statusCode.CONFLICT).send({
        success: false,
        message: "Please ensure all SKU IDs are unique across variations.",
      });
    }

    const objectProductId = new mongoose.Types.ObjectId(productId); 

    const existingSkuIds = await productSchema.aggregate([
      { $unwind: "$variation" }, 
      {
        $match: {
          "variation.skuId": { $in: skuIds }, 
          _id: { $ne: objectProductId }, 
        },
      },
      { $project: { "variation.skuId": 1 } }, 
    ]);

    if (existingSkuIds.length > 0) {
      return res.status(statusCode.CONFLICT).send({
        success: false,
        message: "One or more SKU IDs already exist across products.",
      });
    }

    const newVariation = variations.map((variation) => {
      const jsonVariation = JSON.parse(variation);
      if (jsonVariation.details)
        jsonVariation.details = JSON.parse(jsonVariation.details);
      return jsonVariation;
    });

    const updatedProduct = await productSchema.findByIdAndUpdate(productId, {
      productName,
      sellerId,
      brandName,
      category,
      description,
      tags,
      variation: newVariation,
    });
    updatedProduct.isDraft = false;
    updatedProduct.save();
    if (updatedProduct) {
      sendNotification(updatedProduct, req.headers.authorization);

      return res.status(statusCode.OK).json({
        success: true,
        message: "Product updated successfully.",
        data: updatedProduct,
      });
    }
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update product.",
    });
  } catch (error) {
    console.error(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
