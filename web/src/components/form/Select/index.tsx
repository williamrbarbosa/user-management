import React from "react";
import { FieldErrors, UseFormRegisterReturn } from "react-hook-form";

import { getErrorMessage } from "@/helpers/forms";
import Label from "@/components/ui/Label";

interface Options {
  name: string;
  value: string;
}

interface SelectProps extends React.HTMLAttributes<HTMLElement> {
  register?: UseFormRegisterReturn;
  errors?: FieldErrors;
  field: string;
  label?: string;
  options: Options[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = (props) => {
  const {
    register,
    errors,
    field,
    label,
    options,
    required,
    disabled,
    className,
  } = props;

  const showError = () => {
    if (!errors) {
      return null;
    }

    return (
      <span className="text-xs font-normal text-primary">
        {getErrorMessage(errors, field)}
      </span>
    );
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex gap-1">
          <Label id={`${field}_label`} text={label} />
          {required && <span className="text-red-500">*</span>}
        </div>
      )}
      <select
        disabled={disabled}
        {...register}
        id={`${field}_input`}
        className={`${className} ${disabled && "bg-gray-300"} block w-full rounded-sm border-0 
          p-3 py-4 rounded shadow-sm outline-none
          bg-gray-200 text-gray-950 placeholder:text-gray-500 
          dark:bg-zinc-800 dark:text-white
          placeholder:text-md
          focus:outline-none sm:text-sm sm:leading-6`}
      >
        {!required && <option value="">Status</option>}
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          );
        })}
      </select>
      {showError()}
    </div>
  );
};

export default Select;

export type { SelectProps };
