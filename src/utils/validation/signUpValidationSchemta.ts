import * as Yup from "yup";

export const SignUpValidationSchema = Yup.object({
  username: Yup.string().required(),
  email: Yup.string()
    .required()
    .email(),
  password: Yup.string()
    .required()
    .min(8,),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")],)
    .required(),
});
