"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import Form from "@/components/form";
import { useState } from "react";
import { LoginPayload } from "@/modules/auth/auth.service";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
  rememberme: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    const authLogin: LoginPayload = {
      email: data.email,
      password: data.password,
      rememberme: data.rememberme || false,
    };

    setLoading(true);

    try {
      const success = await login(authLogin);
      if (success) {
        router.push("/home");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-zinc-300">
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader type="component" message="Signing you in..." />
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-100 p-8 rounded-xl w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold dark:text-zinc-950 dark:text-gray-100 text-center">
          Sign-in
        </h1>

        <div className="flex gap-2 mb-1">
          <Form.Item>
            <Form.Input
              register={register("email")}
              errors={errors}
              field="email"
              required
              placeholder="Email"
              type="text"
              autoComplete="email"
            />
          </Form.Item>
        </div>

        <div className="flex gap-2 mb-1">
          <Form.Item>
            <Form.Input
              register={register("password")}
              errors={errors}
              field="password"
              required
              placeholder="Password"
              type="password"
              icon
            />
          </Form.Item>
        </div>

        <label className="flex items-center gap-2 text-zinc-700 text-sm">
          <input type="checkbox" {...register("rememberme")} />
          Remember-me
        </label>

        <button
          disabled={loading}
          aria-label="Sign Button"
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded text-white font-semibold cursor-pointer"
        >
          {loading ? "Signing in..." : "Sign-in"}
        </button>

        <div className="text-center text-sm text-zinc-700">
          {"Don't have an account? "}
          <a
            href="/register"
            aria-label="Register URL"
            className="text-blue-500 hover:text-blue-400 transition"
          >
            Sign up here
          </a>
        </div>
      </form>
    </div>
  );
}
