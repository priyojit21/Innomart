import { statusCode } from "../../config/constant.js";
import BusinessAddress from "../../models/business/businessAddressSchema.js";
import Business from "../../models/business/businessSchema.js";

export const businessAddressController = async (req, res) => {
  try {
    const {
      country,
      address,
      zipCode,
    } = req.body;
    const{businessId}=req.params;
    const findBusiness = await Business.findById(businessId);
    
    const existingBusinessAddress = await BusinessAddress.findOne({
      address,
      zipCode,
      businessId,
    });

    if (existingBusinessAddress) {
      return res.status(statusCode.CONFLICT).json({
        success: false,
        message: "This business address Already Exists.",
      });
    }

    const newBusinessAddress = await BusinessAddress.create({
      businessId,
      country,
      address,
      zipCode,
    });

    if (newBusinessAddress) {
      const status = findBusiness.status + 1;
      findBusiness.status = status;
      findBusiness.save();
      res.status(statusCode.CREATED).json({
        success: true,
        message: "Business address created successfully.",
        data : newBusinessAddress,status,
      });
    }
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};


// import { statusCode } from "../../config/constant.js";
// import BusinessAddress from "../../models/business/businessAddressSchema.js";
// import Business from "../../models/business/businessSchema.js"; // Assuming this model exists

// export const businessAddressController = async (req, res) => {
//   try {
//     const {
//       country,
//       address,
//       zipCode,
//       userId, 
//       // addressProof,
//     } = req.body;
//     const { businessId } = req.query; // Getting businessId from query

//     let business;
//     const sellerId = userId;

//     if (businessId) {
//       // Search by businessId from query
//       business = await Business.findById(businessId);
//       if (!business) {
//         return res.status(statusCode.NOT_FOUND).json({
//           success: false,
//           message: "Business not found with the provided businessId.",
//         });
//       }
//     } else if (sellerId) {
//       // Search by sellerId from request body if businessId isn't provided
//       business = await Business.findOne({ sellerId });
//       if (!business) {
//         return res.status(statusCode.NOT_FOUND).json({
//           success: false,
//           message: "Business not found for the provided sellerId.",
//         });
//       }
//     } else {
//       // Neither businessId nor sellerId provided
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         message: "businessId query or sellerId in body is required.",
//       });
//     }

//     const existingBusinessAddress = await BusinessAddress.findOne({
//       address,
//       zipCode,
//       sellerId : userId,
//       businessId: business._id,
//     });

//     if (existingBusinessAddress) {
//       return res.status(statusCode.CONFLICT).json({
//         success: false,
//         message: "This business address already exists.",
//       });
//     }

//     const newBusinessAddress = await BusinessAddress.create({
//       businessId: business._id,
//       sellerId : userId,
//       country,
//       address,
//       zipCode,
//       // addressProof,
//     });

//     res.status(statusCode.CREATED).json({
//       success: true,
//       message: "Business address created successfully.",
//       data: newBusinessAddress,
//     });

//   } catch (error) {
//     res.status(statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
