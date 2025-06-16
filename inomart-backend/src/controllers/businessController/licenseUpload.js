import fs from "fs";
import Business from "../../models/business/businessSchema.js";
import { statusCode } from "../../config/constant.js";

// License Upload
export const businesslicenseUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(statusCode.UNSUPPORTED_MEDIA_TYPE).send({
        success: false,
        message: "No file uploaded.",
      });
    }
    const { id } = req.params;

    const data = await Business.findById({ _id: id });

    // remove the existing image from uploads folder as well
    if (data.businessLicense !== "") {
      const oldFilePath = data.businessLicense.replace(
        process.env.BASE_URL,
        ""
      );
      fs.existsSync(oldFilePath) && fs.unlinkSync(oldFilePath);
    }
    data.businessLicense =
      `${process.env.BASE_URL}uploads/business/` + req.file.filename;
    await data.save();
    res.status(statusCode.OK).json({
      success: true,
      message: "Business License Added Successfully",
      businessLicense: data.businessLicense,
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
