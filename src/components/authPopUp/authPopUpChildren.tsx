import { useState } from "react";
import AuthPopUp from "./authPopUp";
import SignInForm from "./signInForm";
import SignUpForm from "./signUpForm";

export default function AuthPopUpChildren() {
  const [signIn, setSignIn] = useState(true);
  return (
    <div>
      {signIn ? (
        <AuthPopUp>
          <div className="flex flex-col gap-5">
            <h1 className="text-3xl text-white">Sign In</h1>
            <SignInForm />
            <p className="w-full text-center text-white">
              Do not have any account?{" "}
              <span className="cursor-pointer text-blue-200 " onClick={() => setSignIn(!signIn)}>Registr Here</span>
            </p>
          </div>
        </AuthPopUp>
      ) : (
        <AuthPopUp>
          <div className="flex flex-col gap-5">
          <h1 className="text-3xl text-white">Sign Up</h1>
          <SignUpForm setSignIn = {setSignIn} />
          <p className="w-full text-center text-white">
            already have An Account{" "}
            <span  className="cursor-pointer text-blue-200 " onClick={() => setSignIn(!signIn)}>Log in </span>
          </p>

          </div>
        </AuthPopUp>
      )}
    </div>
  );
}
