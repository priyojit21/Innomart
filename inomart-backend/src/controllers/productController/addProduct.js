import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Product from "../../models/product/productSchema.js";
import categorySchema from "../../models/product/categorySchema.js";
import { fileURLToPath } from "url";
import { statusCode } from "../../config/constant.js";
import BwipJs from "bwip-js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addProduct = async (req, res) => {
  try {
    const {
      productName,
      sellerId,
      brandName,
      description,
      category,
      tags,
      variations,
      weight,
      dimensions,
      shippingMethods,
      deliveryTime,
      freeShipping,
      isEnabled,
    } = req.body;
    const categories = Array.isArray(category) ? category : [category];
    const skuIds = variations.map((variation) => JSON.parse(variation).skuId);
    const uniqueSkuIds = new Set(skuIds);

    if (uniqueSkuIds.size !== skuIds.length) {
      return res.status(statusCode.CONFLICT).send({
        success: false,
        message: "Please ensure all SKU IDs are unique across variations.",
      });
    }
    const existingSkuIds = await Product.aggregate([
      { $unwind: "$variation" },
      { $match: { "variation.skuId": { $in: skuIds } } },
      { $project: { "variation.skuId": 1 } },
    ]);

    if (existingSkuIds.length > 0) {
      return res.status(statusCode.CONFLICT).send({
        success: false,
        message: "SKUIDs must be unique",
      });
    }
    const areAllDifferentVariation =
      new Set(variations).size === variations.length;

    if (!areAllDifferentVariation)
      return res.status(statusCode.CONFLICT).send({
        success: false,
        message: "Please add distinct variation.",
      });

    const newVariation = variations.map((variation) => {
      const jsonVariation = JSON.parse(variation);
      if (jsonVariation.details)
        jsonVariation.details = JSON.parse(
          jsonVariation.details.toString().toLowerCase()
        );
      return jsonVariation;
    });

    if (req.files.length === 0) {
      return res.status(statusCode.UNSUPPORTED_MEDIA_TYPE).send({
        success: false,
        message:
          "No product image uploaded. Please add the product with images.",
      });
    }

    const findProduct = await Product.findOne({
      productName,
      sellerId,
      category: { $in: categories },
      description,
      brandName,
      tags,
    });

    const findCategory = await categorySchema.find({
      _id: { $in: categories },
    });
    if (!findCategory || findCategory.length == 0) {
      return res.status(statusCode.NOT_FOUND).json({
        success: true,
        message: "This category doesnot exist",
      });
    }
    if (findProduct) {
      return res.status(statusCode.CONFLICT).json({
        success: true,
        message: "Product already present. Please update product.",
      });
    }

    const productImages = req.files.map((file) => {
      return `${process.env.BASE_URL}uploads/product/` + file.filename;
    });

    const newProduct = await Product.create({
      productName,
      sellerId,
      brandName,
      category: categories,
      description,
      tags,
      variation: newVariation,
      productImages,
      weight,
      dimensions,
      shippingMethods,
      deliveryTime,
      freeShipping,
      isEnabled,
    });

    const barcodeDir = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "uploads",
      "barCodes"
    );
    const barcodeData = newProduct._id.toString();

    if (!fs.existsSync(barcodeDir)) {
      fs.mkdirSync(barcodeDir, { recursive: true });
    }

    BwipJs.toBuffer(
      {
        bcid: "code128",
        text: barcodeData,
        scale: 3,
        height: 30,
        includetext: true,
        textxalign: "center",
        format: "png",
      },
      async (err, png) => {
        if (err) {
          return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error generating barcode: " + err.message,
          });
        }

        const barcodePath = path.join(barcodeDir, `${barcodeData}.png`);
        fs.writeFileSync(barcodePath, png);

        newProduct.barcode = `${process.env.BASE_URL}uploads/barCodes/${barcodeData}.png`;
        await newProduct.save();

        res.status(statusCode.CREATED).json({
          success: true,
          message: "New product added successfully.",
          data: newProduct,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: "server error",
      message: error.message,
    });
  }
};
