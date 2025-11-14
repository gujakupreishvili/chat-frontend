import React from "react";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export default function TextError({ children, className = "" }: Props) {
  return <p className={`text-red-300 pt-1 ${className}`}>{children}</p>;
}
