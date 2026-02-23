import { FieldErrors } from "react-hook-form";

export const getErrorMessage = (errors: FieldErrors, field: string) => {
  if (errors[field] && errors[field]?.message) {
    return errors[field]?.message?.toString();
  }
  return "";
};
