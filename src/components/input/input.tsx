import { ErrorMessage, Field } from 'formik';
import TextError from '../textError/textError';

type Props = {
  lableTxt: string;
  name: string;
  type: string;
  placeholder?: string;
  error?: string;
  touched?: boolean;
};


export default function Input({  lableTxt,
  name,
  type,
  placeholder,
  error,
  touched,}:Props) {
  return (
    <div className="w-full mb-[15px] relative h-[80px]">
    <Field
        className={`border-[1px] ${
          error && touched
            ? "border-red-200"
            : "border-[#757575]"
        } peer  w-full h-[52px] rounded-[30px] outline-none px-[30px] text-white`}
      name={name}
      type={type}
      placeholder={placeholder}
    />
     <label htmlFor="" className={`${error && touched ? "text-red-200" : " text-white"}     absolute 
      left-[18px] 
      top-[13px]
      bg-gray-400
      text-base 
      px-1 
      transition-all 
      duration-300 
      pointer-events-none
      peer-focus:top-[-12px] 
      peer-not-placeholder-shown:top-[-12px]
 `}>{lableTxt}</label>
    <ErrorMessage name={name}>
      {(msg) => <TextError className="pl-[10px]">{msg}</TextError>}
    </ErrorMessage>
  </div>
  )
}
