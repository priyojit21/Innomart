import { statusCode } from "../../config/constant.js";
import Users from "../../models/users/userSchema.js";
import UsersAddress from "../../models/users/userAddressSchema.js";
import Business from "../../models/business/businessSchema.js";
import BusinessAddress from "../../models/business/businessAddressSchema.js";

export const getUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const findUser = await Users.findOne({ _id: userId });

    if (!findUser) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "No user Found",
      });
    }

    let findBusiness;
    let businessAddresses;

    if (findUser.role === "Seller") {
      findBusiness = await Business.find({ sellerId: userId });

      if (!findBusiness) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "No Business Avialable",
        });
      }

      const businessIds = findBusiness.map(({ _id }) => _id);

      businessAddresses = await BusinessAddress.find({
        businessId: { $in: businessIds },
      });
    }

    const userAddress = await UsersAddress.find({ userId });

    if (!userAddress) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "No Address Found",
      });
    }

    let userProfile ;
    if (findUser.role === "Seller") {
      userProfile = {
        details: findUser,
        address: userAddress,
        business: findBusiness,
        businessAddress: businessAddresses,
      };
    } else {
      userProfile = {
        details: findUser,
        address: userAddress,
      };
    }

    return res.status(statusCode.OK).json({
      success: true,
      message: "User Fetch Success",
      userProfile,
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
