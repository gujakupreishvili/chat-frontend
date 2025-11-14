import * as Yup from "yup";

export const SignInValidationSchema = Yup.object({
  email: Yup.string()
    .required()
    .email(),
  password: Yup.string().required(),
});
