import { statusCode } from "../../config/constant.js";
import businessAddressSchema from "../../models/business/businessAddressSchema.js";
import Business from "../../models/business/businessSchema.js";
import UsersBankDetails from "../../models/users/userBankDetailsSchema.js";
import User from "../../models/users/userSchema.js";

export const accumulateData = async(req,res) => {
    try {
        const {userId} = req.body;
        const user = await User.findOne({_id : userId});
        const userBusiness = await Business.findOne({sellerId : userId});
        const userAddress = await businessAddressSchema.findOne({
            businessId : userBusiness._id});
        const userBank = await UsersBankDetails.findOne({userId : userId});
        userBusiness.isVerified = true;
        const status = userBusiness.status+1;
        userBusiness.status = status;
        userBusiness.save();
        const userDetail = {
                user  : user,
                business  : userBusiness,
                address : userAddress,
                bank : userBank,status,
        };
        return res.status(statusCode.OK).json({
            success:true,
            message : "User fetched",
            data : userDetail,
        });
    } catch (error) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : error.message,
        });
    }
};