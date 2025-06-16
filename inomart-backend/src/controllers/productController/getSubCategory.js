import { statusCode } from "../../config/constant.js";
import productSchema from "../../models/product/productSchema.js";

export const getSubCategory = async (req, res) => {
    try {
        const { category } = req.body;
        const subCategory = [];

        const products = await productSchema.find({ category: category });

        if (products) {
            products.forEach((product) => {
                if (product.subCategory && !subCategory.includes(product.subCategory)) {
                    subCategory.push(product.subCategory);
                }
            });
            return res.status(statusCode.OK).json({
                success: true,
                data: Array.from(subCategory),
                message: "Data fetched successfully"
            });
        } else {
            return res.status(statusCode.OK).json({
                success: true,
                message: "No products found for the given category"
            });
        }
    } catch (error) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error occurred: " + error
        });
    }
};
