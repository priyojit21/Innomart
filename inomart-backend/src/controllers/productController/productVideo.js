import fs from "fs";
import { statusCode } from "../../config/constant.js";
import productSchema from "../../models/product/productSchema.js";
import dotenv from "dotenv";
dotenv.config();

export const productVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(statusCode.NOT_FOUND).json({
                success: false,
                status: statusCode.NOT_FOUND,
                message: "Product Video Not Found"
            });
        }

        const { sellerId } = req.body;
        const { productId } = req.params;

        const findProduct = await productSchema.findOne({ _id: productId, sellerId: sellerId });


        if (findProduct) {
            // Checking for any existing video
            if (findProduct.productVideo) {
                const oldVideoPath = findProduct.productVideo.replace(`http://localhost:${process.env.PORT}/`, "");
                if (fs.existsSync(oldVideoPath)) {
                    fs.unlinkSync(oldVideoPath);
                }
            }

            // Updating the product video
            findProduct.productVideo = `http://localhost:${process.env.PORT}/uploads/product/` + req.file.filename;
            await findProduct.save();

            return res.status(200).json({
                success: true,
                message: `File uploaded successfully: ${req.file.filename}`,
            });
        } else {
            return res.status(statusCode.NOT_FOUND).json({
                success: false,
                message: "Product not found"
            });
        }
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error Occurred: " + error.message
        });
    }
};