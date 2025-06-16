import * as yup from "yup";

const isValidJSON = (value) => {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

export const draftValidation = yup.object().shape({
  productName: yup.string().trim().required("Product name is required."),
});
