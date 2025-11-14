import { Form, Formik } from "formik";
import { SignInValidationSchema } from "../../utils/validation/signInValidationSchemta";
import Input from "../input/input";
import Button from "../button/button";
import { useCookies } from "react-cookie";
import { axiosInstance } from "../../lib/axiosInstance";
import type { SignInTypes } from "../../types/authTypes";

const SignInValue: SignInTypes = {
  email: "",
  password: "",
};

export default function SignInForm() {
  const [, setCookie] = useCookies(["token"]);

  const SignIn = async (values: SignInTypes) => {
    try {
      const res = await axiosInstance.post("api/auth/login", values);
      const token = res.data.token;

      setCookie("token", token, {
        path: "/",
        maxAge: 86400,
      });

      console.log("congrats");
    } catch (error) {
      console.error("error:", error);
    }
  };
  return (
    <>
      <Formik
        initialValues={SignInValue}
        validationSchema={SignInValidationSchema}
        onSubmit={SignIn}
      >
        {({ errors, touched }) => (
          <Form>
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
            <Button
              text="Sign In"
              className="w-full rounded-[30px] text-center h-[45px] bg-blue-300 text-white hover:bg-blue-400 transition-colors duration-[0.5s]"
            />
          </Form>
        )}
      </Formik>
    </>
  );
}
