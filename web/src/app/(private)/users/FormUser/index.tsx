import React from "react";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

import Form from "@/components/form";
import { UserFormData } from "@/schemas/user.schema";

interface FormUserProps {
  handleSubmit: UseFormHandleSubmit<UserFormData>;
  onSubmit: (formValues: UserFormData) => unknown;
  register: UseFormRegister<UserFormData>;
  errors: FieldErrors;
  setValue: UseFormSetValue<UserFormData>;
  idForm?: string;
}

const FormUser: React.FC<FormUserProps> = (props) => {
  const { handleSubmit, onSubmit, register, errors, idForm } = props;

  return (
    <div className="w-full p-4">
      <form id={idForm} onSubmit={handleSubmit(onSubmit)}>
        <Form.Item>
          <Form.Input
            register={register("first_name")}
            errors={errors}
            field="name"
            required
            placeholder="First Name"
            type="text"
          />
          <Form.Input
            register={register("last_name")}
            errors={errors}
            field="last_name"
            required
            placeholder="Last Name"
            type="text"
          />
        </Form.Item>

        <Form.Item>
          <Form.Input
            register={register("email")}
            errors={errors}
            field="email"
            required
            placeholder="Email"
            type="email"
          />
        </Form.Item>
      </form>
    </div>
  );
};

export default FormUser;
