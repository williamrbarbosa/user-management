import React, { ReactNode, useState } from "react";
import { FieldErrors, UseFormRegisterReturn } from "react-hook-form";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import { getErrorMessage } from "@/helpers/forms";
import Label from "@/components/ui/Label";

interface InputProps extends React.HTMLAttributes<HTMLElement> {
  register?: UseFormRegisterReturn;
  errors?: FieldErrors;
  field: string;
  label?: string;
  type: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  icon?: ReactNode;
  className?: string;
  placeholder?: string;
}

const Input: React.FC<InputProps> = (props) => {
  const {
    register,
    errors,
    field,
    label,
    type,
    required,
    disabled,
    autoComplete,
    icon,
    className,
    placeholder,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  const showError = () => {
    if (!errors) {
      return null;
    }

    return (
      <span className="text-xs font-normal text-red-400">
        {getErrorMessage(errors, field)}
      </span>
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex gap-1">
          <Label id={`${field}_label`} text={label} />{" "}
          {required && <span className="text-red-500">*</span>}
        </div>
      )}

      <div className="relative w-full">
        <input
          {...register}
          id={`${field}_input`}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          className={`w-full ${className} ${errors && errors[field] && "border border-red-500"} p-3 rounded shadow-sm outline-none
          bg-gray-200 text-gray-950 placeholder:text-gray-500 
          dark:bg-zinc-800 dark:text-white
          placeholder:text-md
          focus:outline-none sm:text-sm sm:leading-6 disabled:bg-gray-200 `}
          disabled={disabled}
          autoComplete={autoComplete ?? "off"}
          placeholder={placeholder}
        />
        {icon && (
          <span
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center text-gray-500 h-5 w-5 hover:cursor-pointer"
          >
            {type === "password" ? (
              showPassword ? (
                <EyeIcon />
              ) : (
                <EyeSlashIcon />
              )
            ) : (
              icon
            )}
          </span>
        )}
      </div>

      {showError()}
    </div>
  );
};

export default Input;

export type { InputProps };
