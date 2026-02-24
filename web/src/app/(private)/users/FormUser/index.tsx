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

type StatusOption = {
  value: string;
  name: string;
};

const FormUser: React.FC<FormUserProps> = (props) => {
  const { handleSubmit, onSubmit, register, errors, idForm } = props;

  const UserStatus: StatusOption[] = [
    {
      value: "ACTIVE",
      name: "Active",
    },
    {
      value: "INACTIVE",
      name: "Inactive",
    },
  ];

  return (
    <div className="w-full p-4">
      <form id={idForm} onSubmit={handleSubmit(onSubmit)}>
        <Form.Item>
          <Form.Input
            register={register("first_name")}
            errors={errors}
            field="first_name"
            required
            placeholder="First Name"
            label="First Name"
            type="text"
          />
          <Form.Input
            register={register("last_name")}
            errors={errors}
            field="last_name"
            required
            placeholder="Last Name"
            label="Last Name"
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
            label="Email"
            type="email"
          />

          <Form.Input
            register={register("password")}
            errors={errors}
            field="password"
            placeholder="Password"
            required
            label="Password (mín. 6 characteres, only type if you wanna change it)"
            type="password"
          />
        </Form.Item>

        <Form.Item>
          <Form.Select
            register={register("status")}
            errors={errors}
            field="status"
            label="Status"
            disabled={idForm === "create-user"}
            required
            options={UserStatus}
          />
        </Form.Item>
      </form>
    </div>
  );
};

export default FormUser;
