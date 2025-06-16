import * as yup from "yup";

export const userNameChange = yup.object({
    firstName: yup.string()
        .trim()
        .min(3, "Minimum 3 characters is required.")
        .required("First name is required."),

    lastName: yup.string()
        .trim()
        .min(2, "Minimum 3 characters is required.")
        .required("Last name is required."),

    phoneNumber: yup.string()
        .trim()
        .length(10, "Phone number must be exactly 10 digits long.")
        .matches(/^[6-9]\d{9}$/,
            "Phone number must be 10 digits and can start with 6, 7, 8, or 9.",
        )
});