import { Form, Formik } from "formik";
import Input from "../input/input";
import Button from "../button/button";
import { SignUpValidationSchema } from "../../utils/validation/signUpValidationSchemta";
import type { SignUpFormProps, SignUpTypes } from "../../types/authTypes";
import { axiosInstance } from "../../lib/axiosInstance";

const SignUpValue: SignUpTypes = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignUpForm({ setSignIn }: SignUpFormProps) {
  const SignUp = async (values: SignUpTypes) => {
    const { username, email, password } = values;
    const dataToSend = { username, email, password };
    try {
      const res = await axiosInstance.post("api/auth/register", dataToSend);
      setSignIn(true);
      console.log("userc create succesfully", res.data);
    } catch (error) {
      console.log("errors,", error);
    }
  };
  return (
    <>
      <Formik
        initialValues={SignUpValue}
        validationSchema={SignUpValidationSchema}
        onSubmit={SignUp}
      >
        {({ errors, touched }) => (
          <Form>
            <Input
              lableTxt="Enter Your Name"
              name="username"
              type="username"
              placeholder=""
              error={errors.username}
              touched={touched.username}
            />

            <Input
              lableTxt="Enter Your Email"
              name="email"
              type="email"
              placeholder=""
              error={errors.email}
              touched={touched.email}
            />
            <Input
              lableTxt="Enter Your Password"
              name="password"
              type="password"
              placeholder=""
              error={errors.password}
              touched={touched.password}
            />
            <Input
              lableTxt="Repeat Your Password"
              name="confirmPassword"
              type="password"
              placeholder=""
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
            />
            <Button
              text="Register"
              className="w-full rounded-[30px] text-center h-[45px] bg-blue-300 text-white hover:bg-blue-400 transition-colors duration-[0.5s]"
            />
          </Form>
        )}
      </Formik>
    </>
  );
}
