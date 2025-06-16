import userBankDetailsSchema from "../../models/users/userBankDetailsSchema.js";
import { statusCode } from "../../config/constant.js";
import Business from "../../models/business/businessSchema.js";

export const createBankDetails = async(req, res) => {
  try {
    const {userId,userName , bankName  , accountNumber , ifscCode , taxNumber , payoutMethod} = req.body;
    const bankAccExists = await userBankDetailsSchema.findOne({userId:userId , accountNumber});
    const {businessId} = req.params;
    const findBusiness = await Business.findById(businessId);
    

    if(bankAccExists)
    {
        res.status(statusCode.BAD_REQUEST).json({
            success : false,
            message:"Bank Account Already Exists"
        });
    }
    else
    {
        const response = await userBankDetailsSchema.create({
            userId : userId,
            userName : userName ,
            bankName : bankName, 
            accountNumber : accountNumber , 
            ifscCode : ifscCode,
            taxNumber : taxNumber,
            payoutMethod : payoutMethod
        });

        if(response)
        {
            const status = findBusiness.status + 1;
            findBusiness.status = status;
            findBusiness.save();
            res.status(statusCode.CREATED).json({
                success : true,
                message:"Bank Details added successfully",
                data : response,status,
            }); 
        }
    }
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBankDetails = async(req , res) => {
    try{
        const {userId} = req.body;
        const response = await userBankDetailsSchema.find({userId});

        if(response)
        {
            res.status(statusCode.OK).json({
                success : true,
                data : response,
                message : "Bank Details Fetched successfully"
            });
        }
        else
        {
            res.status(statusCode.NOT_FOUND).json({
                success : false,
                message : "Bank Details Not Found"
            });
        }
    }
    catch(error)
    {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
    
};
