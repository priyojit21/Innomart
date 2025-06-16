import { ZodError } from "zod";
import { statusCode } from "../config/constant.js";

export const validateData = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          [issue.path] : `${issue.message}`,
        }));
        res.json({
          status: statusCode.BAD_REQUEST,
          message : errorMessages,
          success : false
        });
      } else {
        res.json({
          status: statusCode.INTERNAL_SERVER_ERROR,
          success : false
        });
      }
    }
  };
};


