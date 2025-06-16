import userAddressSchema from "../../models/users/userAddressSchema.js";
import userSchema from "../../models/users/userSchema.js";
import sessionSchema from "../../models/users/sessionSchema.js";
import { statusCode } from "../../config/constant.js";
import cartSchema from "../../models/cart/cartSchema.js";
import orderSchema from "../../models/order/orderSchema.js";
import orderItemSchema from "../../models/order/orderItemSchema.js";
import userBankDetailsSchema from "../../models/users/userBankDetailsSchema.js";
import wishlistSchema from "../../models/cart/wishlistSchema.js";
import businessSchema from "../../models/business/businessSchema.js";
import businessAddressSchema from "../../models/business/businessAddressSchema.js";
import couponSchema from "../../models/product/couponSchema.js";
import feedbackSchema from "../../models/product/feedbackSchema.js";
import productSchema from "../../models/product/productSchema.js";


export const userAccountDelete = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userSchema.findOne({_id : userId});
    
    await userAddressSchema.deleteMany({userId : userId});
    await sessionSchema.deleteMany({userId : userId});
    await userBankDetailsSchema.deleteMany({userId : userId});

    if(user.role === "Customer")
    {
        await cartSchema.deleteMany({userId : userId});
        await orderItemSchema.deleteMany({userId : userId});
        await orderSchema.deleteMany({userId : userId});
        await wishlistSchema.deleteMany({userId : userId});
        await feedbackSchema.deleteMany({userId : userId});
    }
    else
    {
        const business = await businessSchema.find({sellerId : userId});
        const businessId = business.map(({_id}) => _id);

        await businessAddressSchema.deleteMany({businessId : {$in: businessId}});
        await businessSchema.deleteMany({sellerId : userId});
        await couponSchema.deleteMany({userId : userId});
        await productSchema.deleteMany({sellerId : userId});
    }
    await userSchema.deleteOne({_id : userId});

    return res.status(statusCode.OK).json({
        success : true,
        message : "User Removed successfully",
    });
  } 
  catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
