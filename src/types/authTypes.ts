export type SignUpFormProps = {
  setSignIn: React.Dispatch<React.SetStateAction<boolean>>;
};
export type SignUpTypes = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignInTypes = {
  email: string;
  password: string;
};
