import React from "react";

type ButtonProps = {
  text?: string;
  icon?: React.ElementType | undefined;
  className?: string;
  pTagStyle?: string;
  iconStyle?: string;
  isSelected?: boolean;
  onClick?: () => void;
};

export default function Button({
  text,
  icon: Icon,
  className = "",
  pTagStyle,
  iconStyle,
  isSelected = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        cursor-pointer
        ${className}
        ${isSelected ? "bg-[#E3E8EF]" : ""}
      `}
    >
      {Icon && <Icon className={iconStyle} />}
      {text && <p className={pTagStyle}>{text}</p>}
    </button>
  );
}
