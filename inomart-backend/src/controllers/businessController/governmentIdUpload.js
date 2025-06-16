import fs from "fs";
import Business from "../../models/business/businessSchema.js";
import { statusCode } from "../../config/constant.js";

// GovernmentId Upload
export const governmentIdUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(statusCode.UNSUPPORTED_MEDIA_TYPE).send({
        success: false,
        message: "No file uploaded.",
      });
    }
    const {id} = req.params;
    
    const data = await Business.findById({ _id: id });
    
    // remove the existing image from uploads folder as well
    if (data.governmentId !== "") {
      const oldFilePath = data.governmentId.replace(process.env.BASE_URL, "");
      fs.existsSync(oldFilePath) && fs.unlinkSync(oldFilePath);
    }
    data.governmentId =
      `${process.env.BASE_URL}uploads/business/` + req.file.filename;
    await data.save();
    res.status(statusCode.OK).json({
      success: true,
      message: "GovernmentId Added Successfully",
      governmentId : data.governmentId,
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
