import * as yup from "yup";

export type ResendEmailConfirmationFormValues = yup.Asserts<typeof resendEmailConfirmationFormValidationSchema>;

export const resendEmailConfirmationFormValidationSchema = yup.object({
    email: yup.string().email("Enter a valid email").required("Email is required"),
});

export const initialResendEmailConfirmationFormValues: ResendEmailConfirmationFormValues = {
    email: "",
};
