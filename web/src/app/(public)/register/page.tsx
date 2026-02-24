"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService, LoginPayload } from "@/modules/auth/auth.service";
import { RegisterFormData, registerSchema } from "@/schemas/register.schema";
import Loader from "@/components/ui/Loader";
import { useAppStore } from "@/store";
import { messages } from "@/config/messages";
import Form from "@/components/form";
import { ApiError } from "@/services/api";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setToast } = useAppStore();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    if (data.user_password !== data.user_confirm_password) {
      setToast({
        show: true,
        type: "error",
        message: "Passwords does not match.",
      });
    }

    try {
      setLoading(true);
      setError(null);

      const response = await authService.register(data);

      setToast({
        show: true,
        type: response?.error ? "error" : "success",
        message: response?.message || messages.REGISTER_ERROR_MESSAGE,
      });

      const authLogin: LoginPayload = {
        email: data.email,
        password: data.user_password,
        rememberme: false,
      };

      const success = await login(authLogin);
      if (success) {
        setLoading(false);
        router.push("/home");
      } else {
        router.push("/login");
      }
    } catch (err) {
      const error = err as ApiError;
      const errorMessage = error?.message || messages.REGISTER_ERROR_MESSAGE;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-zinc-300">
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader type="component" message="Creating your account..." />
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-100 p-8 rounded-xl w-full max-w-lg space-y-4"
      >
        <h1 className="text-2xl font-bold dark:text-zinc-950 dark:text-gray-100 text-center">
          Create your account
        </h1>

        <div className="flex gap-2 mb-1">
          <Form.Item>
            <Form.Input
              register={register("first_name")}
              errors={errors}
              field="first_name"
              required
              placeholder="First name"
              type="text"
            />
          </Form.Item>
          <Form.Item>
            <Form.Input
              register={register("last_name")}
              errors={errors}
              field="last_name"
              required
              placeholder="Last name"
              type="text"
            />
          </Form.Item>
        </div>

        <div className="flex gap-2 mb-1">
          <Form.Item>
            <Form.Input
              register={register("email")}
              errors={errors}
              field="email"
              required
              placeholder="Email"
              type="text"
            />
          </Form.Item>
        </div>

        <div className="flex gap-2 mb-1">
          <Form.Item>
            <Form.Input
              register={register("user_password")}
              errors={errors}
              field="user_password"
              required
              placeholder="Password"
              type="password"
              autoComplete="new-password"
              icon
            />
          </Form.Item>
        </div>

        <div className="flex gap-2 mb-1">
          <Form.Item>
            <Form.Input
              register={register("user_confirm_password")}
              errors={errors}
              field="user_confirm_password"
              required
              placeholder="Confirm password"
              type="password"
              autoComplete="new-password"
              icon
            />
          </Form.Item>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded text-white font-semibold cursor-pointer"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <div className="text-center text-sm text-zinc-700">
          {"Already have an account? "}
          <a
            href="/login"
            className="text-blue-500 hover:text-blue-400 transition"
          >
            Sign in.
          </a>
        </div>
      </form>
    </div>
  );
}
