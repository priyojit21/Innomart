import { statusCode } from "../../config/constant.js";
import Users from "../../models/users/userSchema.js";

export const userNameUpdate = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body;
    const userId = req.body.userId;
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "User does not exist"
      });
    }
    
    if (firstName)
      user.firstName = firstName;
    if (lastName)
      user.lastName = lastName;
    if (phoneNumber)
      user.phoneNumber = phoneNumber;
    await user.save();

    return res.status(statusCode.OK).json({
      success: true,
      message: "Updated",
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber : user.phoneNumber
    });
  }
  catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};